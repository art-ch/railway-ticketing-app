import React, { useState } from 'react';

import { Booking as BookingType } from 'railway-ticketing-app-sdk';
import { Button } from '@/components/ui/button';
import { axiosInstance } from '@/api/axios/axios';
import { LoaderCircle, TicketX as TicketXIcon } from 'lucide-react';

export type CancelBookingButtonProps = {
  bookingInfo: BookingType;
  isBookingLoading: boolean;
  onSuccess: (receivedData: BookingType) => void;
  onError: () => void;
};

export const CancelBookingButton = ({
  bookingInfo,
  isBookingLoading,
  onSuccess,
  onError
}: CancelBookingButtonProps) => {
  const [isCancellationInProgress, setIsCancellationInProgress] =
    useState(false);

  const handleSubmit = async () => {
    setIsCancellationInProgress(true);

    try {
      const response = await axiosInstance.patch(
        `/bookings/${bookingInfo.bookingId}`,
        {
          status: 'CANCELLED'
        }
      );

      const receivedData = response.data.data || null;

      onSuccess(receivedData);
    } catch (error) {
      console.error(error);

      onError();
    } finally {
      setIsCancellationInProgress(false);
    }
  };

  const isBookingBeingProcessed = isCancellationInProgress || isBookingLoading;

  return (
    <Button
      className="size-sm self-end mt-4 bg-red-600 hover:bg-red-500 cursor-pointer disabled:cursor-not-allowed"
      onClick={() => handleSubmit()}
      disabled={isBookingBeingProcessed}
    >
      {isBookingBeingProcessed ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <TicketXIcon />
      )}
      Cancel Booking
    </Button>
  );
};
