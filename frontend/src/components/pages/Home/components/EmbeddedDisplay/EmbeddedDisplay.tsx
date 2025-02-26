import React from 'react';

export type EmbeddedDisplayProps = { content: React.ReactNode };

export const EmbeddedDisplay = ({ content }: EmbeddedDisplayProps) => {
  return (
    <div className="border-[8px] border-slate-200">
      <div className="min-w-30 min-h-full border-[4px] border-slate-400">
        <div className="text-white text-5xl p-3 font-dot-matrix font-bold">
          {content}
        </div>
      </div>
    </div>
  );
};
