'use client';

import React from 'react';

import { TrainScheduleDisplay } from './components/TrainScheduleDisplay/TrainScheduleDisplay';
import { EmbeddedDisplay } from './components/EmbeddedDisplay/EmbeddedDisplay';
import { Clock } from './components/Clock/Clock';
import { Train } from './components/Train/Train';
import { Train as TrainType } from 'railway-ticketing-app-sdk';
import { DemoWrapper } from '@/components/DemoWrapper/DemoWrapper';

export type HomeProps = { trainList: TrainType[] };

export const Home = ({ trainList }: HomeProps) => {
  return (
    <DemoWrapper>
      <main className="min-w-screen min-h-screen bg-slate-50 flex items-center justify-center">
        <article className="w-[calc(100vw-250px)] h-[calc(100vh-50px)]">
          <TrainScheduleDisplay>
            <div className="flex justify-between relative">
              <EmbeddedDisplay
                content={new Date().toISOString().split('T')[0]}
              />
              <h1 className="text-amber-300 text-5xl font-bold tracking-widest absolute top-7 left-[37%]">
                Train Schedule
              </h1>
              <EmbeddedDisplay content={<Clock />} />
            </div>

            <div className="text-amber-300 font-bold tracking-widest px-3 text-xl grid grid-cols-[1fr_250px_250px_150px_150px]">
              <div>Train Firm Name</div>
              <div>From</div>
              <div>To</div>
              <div>Arrival</div>
              <div>Departure</div>
            </div>

            <div className="w-full h-full overflow-y-scroll scrollbar-hidden relative">
              {trainList.map((train) => (
                <Train key={train.trainId} train={train} />
              ))}
            </div>
          </TrainScheduleDisplay>
        </article>
      </main>
    </DemoWrapper>
  );
};
