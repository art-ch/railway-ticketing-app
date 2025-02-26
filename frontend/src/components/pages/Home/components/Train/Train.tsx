'use client';

import React from 'react';

import { Train as TrainType } from '@/models';
import Link from 'next/link';

export type TrainProps = { train: TrainType };

export const Train = ({ train }: TrainProps) => {
  const {
    trainId,
    name,
    departureStation,
    arrivalStation,
    departureTime,
    arrivalTime
  } = train;

  const formattedDepartureTime = new Date(departureTime).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  );

  const formattedArrivalTime = new Date(arrivalTime).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  );

  return (
    <Link
      href={`/${trainId}`}
      target="blank"
      className="text-white text-3xl p-3 font-dot-matrix font-bold grid grid-cols-[1fr_250px_250px_150px_150px] hover:bg-amber-300 hover:text-black hover:font-extrabold hover:cursor-pointer"
    >
      <div>{name}</div>
      <div>{departureStation}</div>
      <div>{arrivalStation}</div>
      <div>{formattedDepartureTime}</div>
      <div>{formattedArrivalTime}</div>
    </Link>
  );
};
