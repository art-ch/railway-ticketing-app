import React from 'react';

export type TrainScheduleDisplayProps = { children: React.ReactNode };

export const TrainScheduleDisplay = ({
  children
}: TrainScheduleDisplayProps) => {
  return (
    <div className="w-full h-full shadow-[10px_10px_80px_0px_grey] border-[15px] border-slate-200">
      <div className="w-full h-full border-[3px] border-slate-400">
        <div className="w-full h-full bg-zinc-900 flex flex-col gap-5">
          {children}
        </div>
      </div>
    </div>
  );
};
