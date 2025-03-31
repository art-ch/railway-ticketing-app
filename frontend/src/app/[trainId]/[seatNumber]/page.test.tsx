import React from 'react';
import { render } from '@testing-library/react';
import SeatBookingPage from './page';
import { BookingPageProviderProps } from './context';
import { BookingProps } from '@/components/pages/Booking/Booking';

jest.mock('./context', () => ({
  BookingPageProvider: ({ children, seatNumber }: BookingPageProviderProps) => (
    <div data-testid="booking-provider" data-seat={seatNumber}>
      {children}
    </div>
  )
}));

jest.mock('@/components/pages/Booking/Booking', () => ({
  Booking: ({ seatNumber }: BookingProps) => (
    <div data-testid="booking-component" data-seat={seatNumber}>
      Booking Component
    </div>
  )
}));

describe('SeatBookingPage', () => {
  it('passes the correct seatNumber to BookingPageProvider and Booking', async () => {
    // Create mock params
    const params = { seatNumber: '42A' };

    // Render the component
    const { getByTestId } = render(await SeatBookingPage({ params }));

    // Check if BookingPageProvider received the correct seatNumber
    const provider = getByTestId('booking-provider');
    expect(provider).toHaveAttribute('data-seat', '42A');

    // Check if Booking component received the correct seatNumber
    const bookingComponent = getByTestId('booking-component');
    expect(bookingComponent).toHaveAttribute('data-seat', '42A');
  });
});
