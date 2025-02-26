import React from 'react';

import { Train as TrainType } from '@/models';

export type TrainProps = { trainInfo: TrainType | null };

export const Train = ({ trainInfo }: TrainProps) => {
  if (!trainInfo) {
    return <div>404. Train not found</div>;
  }

  return <div>Page for train {trainInfo.trainId}</div>;
};
