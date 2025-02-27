import React from 'react';

import { Train as TrainType } from '@/models';
import { Seat } from './components/Seat/Seat';
import { getFormattedTime } from '@/utils/formatters';

export type TrainProps = { trainInfo: TrainType | null };

export const Train = ({ trainInfo }: TrainProps) => {
  if (!trainInfo) {
    return <div>Train not found</div>;
  }

  const {
    departureStation,
    arrivalStation,
    departureTime,
    name,
    trainType,
    seats
  } = trainInfo;

  return (
    <main>
      <div className="w-full border-b border-slate-300 p-2">
        <h1>
          {departureStation} → {arrivalStation},{' '}
          {getFormattedTime(new Date(departureTime))}
        </h1>

        <div className="flex gap-2">
          <div>{name}</div>
          <div>{trainType}</div>
        </div>
      </div>
      <div className="h-[calc(100vh-66px)] flex items-center justify-center">
        <div className="border border-slate-300 rounded-xl p-7 grid grid-cols-5 gap-x-7 gap-y-10">
          {seats.map((seat) => (
            <Seat key={seat.seatNumber} seat={seat} />
          ))}
        </div>
      </div>
    </main>
  );
};
