'use client';
import { createContext, useContext, useState } from 'react';

import { SetState } from '@/types/types';
import { Train } from 'railway-ticketing-app-sdk';

export type TrainPageData = Train | null;

export type TrainPageContextProps = {
  trainData: TrainPageData;
  setTrainData: SetState<TrainPageData>;
};

export const TrainPageContext = createContext<TrainPageContextProps | null>(
  null
);

export type TrainPageProviderProps = {
  children: React.ReactNode;
  pageData: TrainPageData;
};

export const TrainPageProvider = ({
  children,
  pageData
}: TrainPageProviderProps) => {
  const [trainData, setTrainData] = useState<TrainPageData>(pageData);

  return (
    <TrainPageContext.Provider
      value={{
        trainData,
        setTrainData
      }}
    >
      {children}
    </TrainPageContext.Provider>
  );
};
export const useTrainPageContext = () => {
  const context = useContext(TrainPageContext);

  if (!context) {
    throw new Error(
      'useTrainPageContext must be used within a TrainPageProvider'
    );
  }

  return context;
};
