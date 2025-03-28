'use client';

import React, { useState } from 'react';

import { Ticket as TicketIcon, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  FormField as ShadCnFormField,
  Form as ShadCnForm,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  PassengerDetails,
  PassengerDetailsSchema
} from 'railway-ticketing-app-sdk';
import { useTrainPageContext } from '@/app/[trainId]/context';
import { axiosInstance } from '@/api/axios/axios';
import { Booking as BookingType } from 'railway-ticketing-app-sdk';
import { CREATE_BOOKING_FORM_FIELD_CONFIG } from './CreateBookingForm.config';

export type CreateBookingFormProps = {
  seatNumber: string;
  isBookingLoading: boolean;
  onSuccess: (receivedData: BookingType) => void;
  onError: () => void;
};

export const CreateBookingForm = ({
  seatNumber,
  isBookingLoading,
  onSuccess,
  onError
}: CreateBookingFormProps) => {
  const [isCreationInProgress, setIsCreationInProgress] = useState(false);

  const { trainData: trainInfo } = useTrainPageContext();

  const form = useForm({
    resolver: zodResolver(PassengerDetailsSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    }
  });

  if (!trainInfo) {
    return <div>No such train found</div>;
  }

  const handleFormSubmit = async (passengerDetails: PassengerDetails) => {
    setIsCreationInProgress(true);

    try {
      const response = await axiosInstance.post('bookings', {
        trainId: trainInfo.trainId,
        seatNumber: Number(seatNumber),
        passengerDetails
      });

      const receivedData = response.data.data || null;

      onSuccess(receivedData);
    } catch (error) {
      console.error(error);

      onError();
    } finally {
      setIsCreationInProgress(false);
    }
  };

  const isBookingBeingProcessed = isCreationInProgress || isBookingLoading;

  return (
    <ShadCnForm {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <p className="font-bold pb-1">Passenger Info</p>
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-2">
            {CREATE_BOOKING_FORM_FIELD_CONFIG.map((fieldConfig) => (
              <ShadCnFormField
                key={fieldConfig.name}
                control={form.control}
                name={fieldConfig.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white h-6 p-2"
                        type={fieldConfig.type}
                        placeholder={fieldConfig.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            className="flex gap-2 cursor-pointer disabled:cursor-not-allowed bg-blue-800 hover:bg-blue-600"
            type="submit"
            size="sm"
            disabled={isBookingBeingProcessed}
          >
            {isBookingBeingProcessed ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <TicketIcon />
            )}
            Book a seat
          </Button>
        </div>
      </form>
    </ShadCnForm>
  );
};
