import { Booking } from '@/components/pages/Booking/Booking';
import React from 'react';
import { BookingPageProvider } from './context';

export type SeatBookingPageProps = {
  params: { seatNumber: string };
};

export default async function SeatBookingPage({
  params
}: SeatBookingPageProps) {
  // await is required here. Details at https://nextjs.org/docs/messages/sync-dynamic-apis
  const { seatNumber } = await params;

  return (
    <BookingPageProvider seatNumber={seatNumber}>
      <Booking seatNumber={seatNumber} />
    </BookingPageProvider>
  );
}
