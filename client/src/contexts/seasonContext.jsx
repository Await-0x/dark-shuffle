import { useAccount } from '@starknet-react/core';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { dojoConfig } from '../../dojo.config';
import { getSeason } from '../api/indexer';

// Create a context
const SeasonContext = createContext();

// Create a provider component
export const SeasonProvider = ({ children }) => {
  const { address } = useAccount()
  const [values, setValues] = useState({});

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

  return (
    <SeasonContext.Provider value={{
      values
    }}>
      {children}
    </SeasonContext.Provider>
  );
};

// Custom hook to use the SeasonContext
export const useSeason = () => {
  return useContext(SeasonContext);
};

