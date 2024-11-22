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
        end: parseInt(season.end, 16),
        start: parseInt(season.start, 16),
        entryFee: parseInt(season.entry_amount, 16),
        rewardPool: parseInt(season.reward_pool, 16),
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

