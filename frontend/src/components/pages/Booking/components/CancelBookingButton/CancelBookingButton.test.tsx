import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CancelBookingButton } from './CancelBookingButton';
import { axiosInstance } from '@/api/axios/axios';
import '@testing-library/jest-dom';
import { Booking as BookingType } from 'railway-ticketing-app-sdk';

jest.mock('@/api/axios/axios', () => ({
  axiosInstance: {
    patch: jest.fn()
  }
}));

jest.mock('lucide-react', () => ({
  LoaderCircle: () => <div data-testid="loader-icon">Loading</div>,
  TicketX: () => <div data-testid="ticket-x-icon">Cancel Icon</div>
}));

const axiosInstancePatchMock = axiosInstance.patch as jest.Mock;

describe('CancelBookingButton', () => {
  const mockBookingInfo = {
    bookingId: '123',
    status: 'CONFIRMED'
  } as BookingType;

  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button with cancel icon when not loading', () => {
    render(
      <CancelBookingButton
        bookingInfo={mockBookingInfo}
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-x-icon')).toBeInTheDocument();
    expect(screen.getByText('Cancel Booking')).toBeInTheDocument();
  });

  it('should render the button with loader icon when booking is loading', () => {
    render(
      <CancelBookingButton
        bookingInfo={mockBookingInfo}
        isBookingLoading={true}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByText('Cancel Booking')).toBeInTheDocument();
  });

  it('should disable the button when cancellation is in progress', async () => {
    axiosInstancePatchMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <CancelBookingButton
        bookingInfo={mockBookingInfo}
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Button should be enabled initially
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();

    // Click the button to start cancellation
    fireEvent.click(button);

    // Button should be disabled and show loader during cancellation
    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });
  });

  it('should call onSuccess with received data when cancellation succeeds', async () => {
    const mockResponseData = {
      data: {
        data: {
          bookingId: '123',
          status: 'CANCELLED'
        }
      }
    };

    axiosInstancePatchMock.mockResolvedValueOnce(mockResponseData);

    render(
      <CancelBookingButton
        bookingInfo={mockBookingInfo}
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(axiosInstancePatchMock).toHaveBeenCalledWith('/bookings/123', {
        status: 'CANCELLED'
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponseData.data.data);
      expect(mockOnError).not.toHaveBeenCalled();
    });
  });

  it('should call onError when cancellation fails', async () => {
    axiosInstancePatchMock.mockRejectedValueOnce(new Error('Network error'));

    render(
      <CancelBookingButton
        bookingInfo={mockBookingInfo}
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Mock console.error to prevent error output in test logs
    const originalConsoleError = console.error;
    console.error = jest.fn();

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(axiosInstancePatchMock).toHaveBeenCalledWith('/bookings/123', {
        status: 'CANCELLED'
      });
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('should reset cancellation state after API call completes', async () => {
    axiosInstancePatchMock.mockResolvedValueOnce({
      data: { data: { bookingId: '123', status: 'CANCELLED' } }
    });

    render(
      <CancelBookingButton
        bookingInfo={mockBookingInfo}
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Button should be disabled during cancellation
    expect(button).toBeDisabled();

    // After API call completes, button should be enabled again
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(screen.getByTestId('ticket-x-icon')).toBeInTheDocument();
    });
  });
});
