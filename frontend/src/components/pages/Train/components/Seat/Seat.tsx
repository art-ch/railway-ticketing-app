'use client';

import React from 'react';

import { Seat as SeatType } from '@/models';
import { cn } from '@/lib/utils';

export type Props = { seat: SeatType };

export const Seat = ({ seat }: Props) => {
  const { seatNumber, isBooked } = seat;

  const handleBookASeat = async () => {
    console.log('book a seat');
  };

  const isBookedStyle = isBooked
    ? 'text-slate-500 cursor-not-allowed'
    : 'bg-emerald-800 text-white cursor-pointer';

  return (
    <button
      className={cn(
        'border border-slate-300 rounded-sm p-1 text-center text-5xl',
        isBookedStyle
      )}
      onClick={() => handleBookASeat()}
    >
      {seatNumber}
    </button>
  );
};
