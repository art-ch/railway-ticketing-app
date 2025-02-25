import { Seat } from '../models';

export type UpdateSeatStatusProps = {
  seats: Seat[];
  seatNumber: number;
  isBooked: boolean;
  bookingId?: string;
};

export const updateSeatStatus = ({
  seats,
  seatNumber,
  isBooked,
  bookingId
}: UpdateSeatStatusProps): Seat[] => {
  return seats.map((seat, index) =>
    index === seatNumber - 1 ? { ...seat, isBooked, bookingId } : seat
  );
};
