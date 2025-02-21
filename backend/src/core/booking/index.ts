import { Booking } from '../models';

export const createBooking = async (
  booking: Omit<Booking, 'bookingId' | 'status'> // we'll set these internally
): Promise<Booking> => {
  // implementation will come later
};

export const findBookingById = async (id: string): Promise<Booking | null> => {
  // implementation will come later
};

export const updateBookingStatus = async (
  id: string,
  status: Booking['status']
): Promise<void> => {
  // implementation will come later
};
