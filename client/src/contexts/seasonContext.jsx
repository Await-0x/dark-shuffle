import React, { createContext, useState, useContext } from 'react';
import { getEntropy, getSeason, getUnverifiedGames } from '../api/indexer';
import { dojoConfig } from '../../dojo.config';
import { useEffect } from 'react';
import { useAccount } from '@starknet-react/core';
import { getLatestBlock } from '../api/starknet';

// Create a context
const SeasonContext = createContext();

// Create a provider component
export const SeasonProvider = ({ children }) => {
  const { address } = useAccount()

  const [values, setValues] = useState({});
  const [unverifiedGames, setUnverifiedGames] = useState([])
  const [latestBlock, setLatestBlock] = useState(null)

  useEffect(() => {
    async function fetchSeason() {
      const season = await getSeason(dojoConfig.seasonId)
      setValues({
        end: parseInt(season.end),
        start: parseInt(season.start),
        entryFee: parseInt(season.entry_amount),
        rewardPool: parseInt(season.reward_pool),
      })
    }

    fetchSeason()
  }, [])

  useEffect(() => {
    if (address) {
      fetchUnverifiedGames()
    }
  }, [address])

  const fetchUnverifiedGames = async () => {
    const games = await getUnverifiedGames(address, dojoConfig.seasonId)
    if (games.length === 0) {
      return
    }
    
    const gamesWithEntropies = await Promise.all(games.map(async (_game) => {
      const entropy = await getEntropy(_game.game_id, _game.entropy_count);
      return {
        ..._game,
        block_number: parseInt(entropy.block_number, 16),
      };
    }));
    
    setUnverifiedGames(gamesWithEntropies)
  
    let latestBlock = await getLatestBlock()
    setLatestBlock(latestBlock)
  }

  return (
    <SeasonContext.Provider value={{
      values,
      unverifiedGames,
      latestBlock,
      fetchUnverifiedGames
    }}>
      {children}
    </SeasonContext.Provider>
  );
};

// Custom hook to use the SeasonContext
export const useSeason = () => {
  return useContext(SeasonContext);
};

