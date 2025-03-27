'use client';

import React from 'react';

import { useTrainPageContext } from '@/app/[trainId]/context';
import { getFormattedTime } from '@/utils/formatters';

export const TrainInfo = () => {
  const { trainData: trainInfo } = useTrainPageContext();

  if (!trainInfo) {
    return null;
  }

  const {
    trainType,
    departureStation,
    arrivalStation,
    departureTime,
    arrivalTime
  } = trainInfo;

  return (
    <div>
      <p className="font-bold pb-1">Train Info</p>
      <table className="w-full">
        <thead>
          <tr className="text-sm font-semibold">
            <th className="text-left w-[100px]">Type</th>
            <th className="text-left w-[175px]">Origin</th>
            <th className="text-left w-[175px]">Destination</th>
            <th className="text-left w-[50px]">Dep.</th>
            <th className="text-left w-[50px]">Arr.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{trainType}</td>
            <td>{departureStation}</td>
            <td>{arrivalStation}</td>
            <td>{getFormattedTime(new Date(departureTime))}</td>
            <td>{getFormattedTime(new Date(arrivalTime))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
