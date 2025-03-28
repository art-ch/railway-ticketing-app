'use client';

import React from 'react';
import { CreateBookingForm } from './components/CreateBookingForm/CreateBookingForm';
import { Header } from './components/Header/Header';
import { TrainInfo } from './components/TrainInfo/TrainInfo';
import { Booking as BookingType } from 'railway-ticketing-app-sdk';
import { BookingInfo } from './components/BookingInfo/BookingInfo';
import { PassengerInfo } from './components/PassengerInfo/PassengerInfo';
import { CancelBookingButton } from './components/CancelBookingButton/CancelBookingButton';
import { toast } from 'sonner';
import { useBookingPageContext } from '@/app/[trainId]/[seatNumber]/context/context';
import { BookingDataSkeleton } from './components/BookingDataSkeleton/BookingDataSkeleton';
import { DemoWrapper } from '@/components/DemoWrapper/DemoWrapper';

export type BookingProps = {
  seatNumber: string;
};

export const Booking = ({ seatNumber }: BookingProps) => {
  const { bookingData, isBookingLoading, updateBooking } =
    useBookingPageContext();

  // Success callbacks
  const handleBookingSuccess = (newBookingData: BookingType) => {
    updateBooking(Number(seatNumber), newBookingData.bookingId, newBookingData);

    toast.success('Booking successfully created!');
  };

  const handleCancellationSuccess = () => {
    updateBooking(Number(seatNumber), undefined, null);

    toast.success('Booking successfully cancelled!');
  };

  // Error callbacks
  const handleBookingError = () => {
    toast.error('Failed to create booking, please try again later');
  };

  const handleCancellationError = () => {
    toast.error('Failed to cancel booking, please try again later');
  };

  const renderBookingInfo = () => {
    switch (true) {
      case isBookingLoading || bookingData === undefined:
        return <BookingDataSkeleton />;

      case bookingData === null:
        return (
          <CreateBookingForm
            seatNumber={seatNumber}
            isBookingLoading={isBookingLoading}
            onSuccess={handleBookingSuccess}
            onError={handleBookingError}
          />
        );

      case !!bookingData:
        return (
          <div className="flex flex-col">
            <BookingInfo bookingInfo={bookingData} />
            <PassengerInfo passengerInfo={bookingData.passengerDetails} />
            <CancelBookingButton
              bookingInfo={bookingData}
              isBookingLoading={isBookingLoading}
              onSuccess={handleCancellationSuccess}
              onError={handleCancellationError}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DemoWrapper>
      <main className="h-[calc(100vh-66px)] flex flex-col items-center justify-center">
        <div className="relative bg-amber-50 shadow p-4">
          <Header bookingId={bookingData?.bookingId} />
          <TrainInfo />
          {renderBookingInfo()}
        </div>
      </main>
    </DemoWrapper>
  );
};
