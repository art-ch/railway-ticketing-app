import { render } from '@testing-library/react';
import { BookingInfo } from './BookingInfo';
import { Booking as BookingType } from 'railway-ticketing-app-sdk';

describe('BookingDataSkeleton component', () => {
  it('should be rendered correctly', () => {
    const bookingInfo = {
      seatNumber: 1,
      status: 'CONFIRMED',
      bookingTime: '2025-03-31T05:05:11Z'
    } as BookingType;

    const { container } = render(<BookingInfo bookingInfo={bookingInfo} />);

    expect(container).toMatchSnapshot();
  });
});
