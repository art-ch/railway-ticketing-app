import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BookingPageProvider, useBookingPageContext } from './context';
import { useTrainPageContext } from '../context';
import { axiosInstance } from '@/api/axios/axios';
import { Booking as BookingType } from 'railway-ticketing-app-sdk';

jest.mock('../context', () => ({
  useTrainPageContext: jest.fn()
}));

jest.mock('@/api/axios/axios', () => ({
  axiosInstance: {
    get: jest.fn()
  }
}));

// Test component that uses the context
const TestConsumer = () => {
  const { bookingData, isBookingLoading, updateBooking } =
    useBookingPageContext();

  return (
    <div>
      <div data-testid="loading">{isBookingLoading.toString()}</div>
      <div data-testid="booking-status">
        {bookingData === undefined
          ? 'undefined'
          : bookingData === null
          ? 'null'
          : 'booking-exists'}
      </div>
      <button
        data-testid="update-booking"
        onClick={() => updateBooking(1, 'new-booking-123')}
      >
        Update Booking
      </button>
    </div>
  );
};

describe('BookingPageContext', () => {
  const mockTrainData = {
    id: 'train-1',
    seats: [
      { seatNumber: 1, bookingId: 'booking-123' },
      { seatNumber: 2, bookingId: null }
    ]
  };

  const mockSetTrainData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTrainPageContext as jest.Mock).mockReturnValue({
      trainData: mockTrainData,
      setTrainData: mockSetTrainData
    });
  });

  it('should initialize with undefined booking data and fetches booking when seat has bookingId', async () => {
    const mockBookingData = { id: 'booking-123', passengerName: 'John Doe' };
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockBookingData }
    });

    render(
      <BookingPageProvider seatNumber="1">
        <TestConsumer />
      </BookingPageProvider>
    );

    // Initially loading
    expect(screen.getByTestId('loading').textContent).toBe('true');

    // After loading completes
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('booking-status').textContent).toBe(
        'booking-exists'
      );
    });

    // Verify API was called with correct booking ID
    expect(axiosInstance.get).toHaveBeenCalledWith('/bookings/booking-123');
  });

  it('should set booking data to null when seat has no booking', async () => {
    render(
      <BookingPageProvider seatNumber="2">
        <TestConsumer />
      </BookingPageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('booking-status').textContent).toBe('null');
    });

    // API should not be called
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });

  it('should set booking data to null when seat does not exist', async () => {
    render(
      <BookingPageProvider seatNumber="999">
        <TestConsumer />
      </BookingPageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('booking-status').textContent).toBe('null');
    });
  });

  it('should handle API error when fetching booking', async () => {
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(
      new Error('API error')
    );

    render(
      <BookingPageProvider seatNumber="1">
        <TestConsumer />
      </BookingPageProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
      expect(screen.getByTestId('booking-status').textContent).toBe('null');
    });
  });

  it('updateBooking updates train data and fetches new booking', async () => {
    const mockNewBookingData = {
      id: 'new-booking-123',
      passengerName: 'Jane Doe'
    };
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockNewBookingData }
    });

    render(
      <BookingPageProvider seatNumber="1">
        <TestConsumer />
      </BookingPageProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Reset mock to track the next API call
    (axiosInstance.get as jest.Mock).mockClear();
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockNewBookingData }
    });

    // Trigger updateBooking
    act(() => {
      screen.getByTestId('update-booking').click();
    });

    // Verify train data was updated
    expect(mockSetTrainData).toHaveBeenCalled();

    // Verify new booking was fetched
    expect(axiosInstance.get).toHaveBeenCalledWith('/bookings/new-booking-123');
  });

  it('updateBooking with explicit booking data skips API call', async () => {
    const mockExplicitBooking = {
      bookingId: 'explicit-123',
      passengerName: 'Explicit User'
    } as unknown as BookingType;

    // Custom test component for this specific test
    const ExplicitUpdateConsumer = () => {
      const { bookingData, updateBooking } = useBookingPageContext();

      return (
        <div>
          <div data-testid="booking-id">
            {bookingData?.bookingId || 'no-booking'}
          </div>
          <button
            data-testid="update-explicit"
            onClick={() =>
              updateBooking(1, 'explicit-123', mockExplicitBooking)
            }
          >
            Update Explicit
          </button>
        </div>
      );
    };

    render(
      <BookingPageProvider seatNumber="1">
        <ExplicitUpdateConsumer />
      </BookingPageProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    });

    // Reset mock to verify it's not called again
    (axiosInstance.get as jest.Mock).mockClear();

    // Update with explicit booking data
    act(() => {
      screen.getByTestId('update-explicit').click();
    });

    // Verify train data was updated
    expect(mockSetTrainData).toHaveBeenCalled();

    // Verify API was NOT called (since we provided explicit data)
    expect(axiosInstance.get).not.toHaveBeenCalled();

    // Verify booking data was updated directly
    await waitFor(() => {
      expect(screen.getByTestId('booking-id').textContent).toBe('explicit-123');
    });
  });

  it('updateBooking with no bookingId sets booking data to null', async () => {
    // Custom test component for this specific test
    const ClearBookingConsumer = () => {
      const { bookingData, updateBooking } = useBookingPageContext();

      return (
        <div>
          <div data-testid="booking-status">
            {bookingData === null ? 'null' : 'has-booking'}
          </div>
          <button data-testid="clear-booking" onClick={() => updateBooking(1)}>
            Clear Booking
          </button>
        </div>
      );
    };

    render(
      <BookingPageProvider seatNumber="1">
        <ClearBookingConsumer />
      </BookingPageProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    });

    // Reset mock
    (axiosInstance.get as jest.Mock).mockClear();

    // Clear booking
    act(() => {
      screen.getByTestId('clear-booking').click();
    });

    // Verify train data was updated
    expect(mockSetTrainData).toHaveBeenCalled();

    // Verify booking data was set to null
    await waitFor(() => {
      expect(screen.getByTestId('booking-status').textContent).toBe('null');
    });

    // Verify API was NOT called
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });

  it('should throw an error when useBookingPageContext is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    // Expect error when rendering consumer without provider
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useBookingPageContext must be used within a TrainPageProvider');

    // Restore console.error
    console.error = originalError;
  });
});
