import { v4 as uuid } from 'uuid';
import { Booking, BookingSchema } from '../models';
import { findTrainById, updateTrain } from '../trains';
import { getDynamoDBDocClient } from '../../infra/dynamodb';
import { updateSeatStatus } from '../trains/helpers';

const TABLE_NAME = 'BookingsTable';

export const addBooking = async (
  bookingData: Omit<Booking, 'bookingId' | 'status' | 'bookingTime'>
): Promise<Booking> => {
  const docClient = getDynamoDBDocClient();

  // Check if train and seat are available
  const train = await findTrainById(bookingData.trainId);

  if (!train) {
    throw new Error('Train not found');
  }

  const seat = train.seats[bookingData.seatNumber - 1];

  if (seat.isBooked) {
    throw new Error('Seat is already booked');
  }

  // Create new booking
  const booking: Booking = {
    ...bookingData,
    bookingId: uuid(),
    status: 'CONFIRMED',
    bookingTime: new Date().toISOString()
  };

  // Save booking
  await docClient.put({
    TableName: TABLE_NAME,
    Item: booking
  });

  // Update train's seat status
  await updateTrain({
    ...train,
    seats: updateSeatStatus({
      seats: train.seats,
      seatNumber: bookingData.seatNumber,
      isBooked: true,
      bookingId: booking.bookingId
    })
  });

  return booking;
};

export const findBookingById = async (
  bookingId: string
): Promise<Booking | null> => {
  const docClient = getDynamoDBDocClient();

  const result = await docClient.get({
    TableName: TABLE_NAME,
    Key: { bookingId }
  });

  if (!result.Item) {
    return null;
  }

  return BookingSchema.parse(result.Item);
};

export const changeBookingStatus = async (
  bookingId: string,
  status: Booking['status']
): Promise<Booking> => {
  const docClient = getDynamoDBDocClient();

  const booking = await findBookingById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  const updatedBooking = {
    ...booking,
    status
  };

  await docClient.put({
    TableName: TABLE_NAME,
    Item: updatedBooking
  });

  // If cancelled, free up the seat
  if (status === 'CANCELLED') {
    const train = await findTrainById(booking.trainId);

    if (train) {
      await updateTrain({
        ...train,
        seats: updateSeatStatus({
          seats: train.seats,
          seatNumber: booking.seatNumber,
          isBooked: false,
          bookingId: undefined
        })
      });
    }
  }

  return updatedBooking;
};
