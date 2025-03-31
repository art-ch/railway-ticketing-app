import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateBookingForm } from './CreateBookingForm';
import { useTrainPageContext } from '@/app/[trainId]/context';
import { axiosInstance } from '@/api/axios/axios';

jest.mock('@/app/[trainId]/context', () => ({
  useTrainPageContext: jest.fn()
}));

jest.mock('@/api/axios/axios', () => ({
  axiosInstance: {
    post: jest.fn()
  }
}));

const mockTrainData = {
  trainId: 'train-123',
  name: 'Express Train',
  departureTime: '10:00',
  arrivalTime: '12:00'
};

const mockOnSuccess = jest.fn();
const mockOnError = jest.fn();

describe('CreateBookingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTrainPageContext as jest.Mock).mockReturnValue({
      trainData: mockTrainData
    });
  });

  it('should render the form correctly', () => {
    render(
      <CreateBookingForm
        seatNumber="5"
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Check if form elements are rendered
    expect(screen.getByText('Passenger Info')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /book a seat/i })
    ).toBeInTheDocument();

    // Check if all form fields are present
    expect(screen.getByPlaceholderText('Type in a name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type in an email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Type in phone number')
    ).toBeInTheDocument();
  });

  it('should display error message when train data is not available', () => {
    (useTrainPageContext as jest.Mock).mockReturnValue({
      trainData: null
    });

    render(
      <CreateBookingForm
        seatNumber="5"
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByText('No such train found')).toBeInTheDocument();
  });

  it('should disable the submit button when isBookingLoading is true', () => {
    render(
      <CreateBookingForm
        seatNumber="5"
        isBookingLoading={true}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByRole('button', { name: /book a seat/i })).toBeDisabled();
  });

  it('should show loading indicator when form submission is in progress', async () => {
    (axiosInstance.post as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { data: {} } }), 100)
        )
    );

    render(
      <CreateBookingForm
        seatNumber="5"
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Fill out the form
    await userEvent.type(
      screen.getByPlaceholderText('Type in a name'),
      'John Doe'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in an email'),
      'john@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in phone number'),
      '1234567890'
    );

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /book a seat/i }));

    // Check if loading indicator is shown
    await waitFor(() => {
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });
  });

  it('should submit the form with correct data and calls onSuccess', async () => {
    const mockResponseData = { id: 'booking-123', seatNumber: 5 };
    (axiosInstance.post as jest.Mock).mockResolvedValue({
      data: { data: mockResponseData }
    });

    render(
      <CreateBookingForm
        seatNumber="5"
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Fill out the form
    await userEvent.type(
      screen.getByPlaceholderText('Type in a name'),
      'John Doe'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in an email'),
      'john@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in phone number'),
      '1234567890'
    );

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /book a seat/i }));

    await waitFor(() => {
      // Check if API was called with correct data
      expect(axiosInstance.post).toHaveBeenCalledWith('bookings', {
        trainId: 'train-123',
        seatNumber: 5,
        passengerDetails: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890'
        }
      });

      // Check if onSuccess was called with the response data
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponseData);
    });
  });

  it('should handle API errors correctly and calls onError', async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValue(new Error('API Error'));

    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <CreateBookingForm
        seatNumber="5"
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Fill out the form
    await userEvent.type(
      screen.getByPlaceholderText('Type in a name'),
      'John Doe'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in an email'),
      'john@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in phone number'),
      '1234567890'
    );

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /book a seat/i }));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('should validate form fields correctly', async () => {
    render(
      <CreateBookingForm
        seatNumber="5"
        isBookingLoading={false}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    // Submit without filling the form
    fireEvent.click(screen.getByRole('button', { name: /book a seat/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(
        screen.getByText('String must contain at least 1 character(s)')
      ).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    // Fill with invalid email
    await userEvent.type(
      screen.getByPlaceholderText('Type in a name'),
      'John Doe'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in an email'),
      'invalid-email'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Type in phone number'),
      '1234567890'
    );

    // Submit again
    fireEvent.click(screen.getByRole('button', { name: /book a seat/i }));

    // Check for email validation error
    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(
        screen.queryByText('String must contain at least 1 character(s)')
      ).not.toBeInTheDocument();
    });
  });
});
