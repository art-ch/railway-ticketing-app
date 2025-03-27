'use client';

import React from 'react';

import { Seat } from './components/Seat/Seat';
import { useTrainPageContext } from '@/app/[trainId]/context';
import { WideScreenDemoNotice } from '@/components/WideScreenDemoNotice/WideScreenDemoNotice';
import { useBreakpoint } from '@/hooks/useBreakpoint/useBreakpoint';

export const Train = () => {
  const { trainData: trainInfo } = useTrainPageContext();

  const breakPoint = useBreakpoint();

  if (!breakPoint.xl) {
    return <WideScreenDemoNotice />;
  }

  if (!trainInfo) {
    return <div>Train not found</div>;
  }

  const { seats, trainId } = trainInfo;

  return (
    <main>
      <div className="h-[calc(100vh-66px)] flex items-center justify-center">
        <div className="border border-slate-300 rounded-xl p-7 grid grid-cols-5 gap-x-7 gap-y-10">
          {seats.map((seat) => (
            <Seat key={seat.seatNumber} trainId={trainId} seat={seat} />
          ))}
        </div>
      </div>
    </main>
  );
};
