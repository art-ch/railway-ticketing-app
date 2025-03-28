'use client';

import React from 'react';

import { Seat as SeatType } from 'railway-ticketing-app-sdk';
import Link from 'next/link';

export type Props = { trainId: string; seat: SeatType };

export const Seat = ({ trainId, seat }: Props) => {
  const { seatNumber, isBooked } = seat;

  const commonStyles =
    'border border-slate-300 rounded-sm p-1 text-center text-5xl cursor-pointer  text-white';

  const freeSeat = 'bg-emerald-800';
  const bookedSeat = 'bg-amber-500';

  const bookingStateStypes = isBooked ? bookedSeat : freeSeat;

  return (
    <Link
      className={`${commonStyles} ${bookingStateStypes}`}
      href={`/${trainId}/${seatNumber}`}
    >
      {seatNumber}
    </Link>
  );
};
