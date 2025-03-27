import React from 'react';

export type HeaderProps = { bookingId?: string };

export const Header = ({ bookingId }: HeaderProps) => (
  <div>
    <p className="absolute left-4 top-4 border-2 border-black px-1">22</p>
    <div className="flex gap-2 items-baseline justify-center font-bold pb-2">
      <p className="text-sm">art-ch railway</p>
      <p className="text-lg border-l border-r border-black px-2">
        Travel Document
      </p>
      {!bookingId && <p className="text-sm px-2 text-gray-300">booking id</p>}
      {bookingId && (
        <p className="text-sm text-nowrap w-33">
          {/** shortening ID for demo purposes */}
          ID #{bookingId.replace(/(.*?)-.*/, '$1')}
        </p>
      )}
    </div>
  </div>
);
