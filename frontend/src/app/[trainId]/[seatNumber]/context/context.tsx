'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useTrainPageContext } from '../../context';
import { Booking as BookingType } from 'railway-ticketing-app-sdk';
import { axiosInstance } from '@/api/axios/axios';

/** Using `undefined` as initial state to indicate "not yet fetched" */
export type BookingData = BookingType | null | undefined;

export type BookingPageContextProps = {
  bookingData: BookingData;
  isBookingLoading: boolean;
  updateBooking: (
    seatNumber: number,
    bookingId?: string,
    newBooking?: BookingType | null
  ) => void;
};

export const BookingPageContext = createContext<BookingPageContextProps | null>(
  null
);

export type BookingPageProviderProps = {
  children: React.ReactNode;
  seatNumber: string;
};

export const BookingPageProvider = ({
  children,
  seatNumber
}: BookingPageProviderProps) => {
  const { trainData, setTrainData } = useTrainPageContext();

  const [bookingData, setBookingData] = useState<BookingData>(undefined);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const fetchBooking = useCallback(
    async (bookingId: string) => {
      setIsBookingLoading(true);

      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        setBookingData(response.data.data);
      } catch (error) {
        console.error(`Error fetching booking for seat ${seatNumber}:`, error);
        setBookingData(null);
      } finally {
        setIsBookingLoading(false);
      }
    },
    [seatNumber]
  );

  useEffect(() => {
    if (!trainData) return;

    const seatData = trainData.seats.find(
      (seat) => seat.seatNumber.toString() === seatNumber
    );

    if (!seatData) {
      setBookingData(null);
      return;
    }

    if (seatData.bookingId) {
      fetchBooking(seatData.bookingId);
    } else {
      // No booking for this seat
      setBookingData(null);
    }
  }, [fetchBooking, trainData, seatNumber]);

  const updateBooking = (
    seatNumber: number,
    bookingId?: string,
    newBooking?: BookingType | null
  ) => {
    // Update the train data
    updateTrainSeatData(seatNumber, bookingId);

    // Update the booking data based on the scenario
    handleBookingDataUpdate(bookingId, newBooking);
  };

  const updateTrainSeatData = (seatNumber: number, bookingId?: string) => {
    setTrainData((prevData) => {
      if (!prevData) return null;

      const updatedSeats = prevData.seats.map((seat) =>
        seat.seatNumber === seatNumber ? { ...seat, bookingId } : seat
      );

      return {
        ...prevData,
        seats: updatedSeats
      };
    });
  };

  const handleBookingDataUpdate = (
    bookingId?: string,
    newBooking?: BookingType | null
  ) => {
    // Case 1: Explicit booking data provided
    if (newBooking !== undefined) {
      setBookingData(newBooking);
      return;
    }

    // Case 2: New booking ID provided but no data
    if (bookingId) {
      fetchBooking(bookingId);
      return;
    }

    // Case 3: No booking ID (seat is now unbooked)
    setBookingData(null);
  };

  return (
    <BookingPageContext.Provider
      value={{
        bookingData,
        isBookingLoading,
        updateBooking
      }}
    >
      {children}
    </BookingPageContext.Provider>
  );
};

export const useBookingPageContext = () => {
  const context = useContext(BookingPageContext);

  if (!context) {
    throw new Error(
      'useBookingPageContext must be used within a TrainPageProvider'
    );
  }

  return context;
};
