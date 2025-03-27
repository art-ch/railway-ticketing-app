import React from 'react';

import { Booking as BookingType } from '@/models';
import { getFormattedDateTime } from '@/utils/formatters';

export type BookingInfoProps = { bookingInfo: BookingType };

export const BookingInfo = ({ bookingInfo }: BookingInfoProps) => {
  const { seatNumber, status, bookingTime } = bookingInfo;

  return (
    <div>
      <p className="font-bold pb-1">Booking Info</p>

      <table className="w-full">
        <thead>
          <tr className="text-sm font-semibold">
            <th className="text-left">Seat</th>
            <th className="text-left">Status</th>
            <th className="text-left">Booked at</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{seatNumber}</td>
            <td>{status}</td>
            <td>{getFormattedDateTime(new Date(bookingTime))}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
