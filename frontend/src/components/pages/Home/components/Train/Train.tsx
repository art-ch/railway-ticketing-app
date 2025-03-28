'use client';

import React from 'react';

import { Train as TrainType } from 'railway-ticketing-app-sdk';
import Link from 'next/link';
import { getFormattedTime } from '@/utils/formatters';

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

  const formattedDepartureTime = getFormattedTime(new Date(departureTime));
  const formattedArrivalTime = getFormattedTime(new Date(arrivalTime));

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
