import {
  BreakpointState,
  useBreakpoint
} from '@/hooks/useBreakpoint/useBreakpoint';
import { render, screen } from '@testing-library/react';
import { Booking } from './Booking';
import { TrainPageData, TrainPageProvider } from '@/app/[trainId]/context';
import {
  BookingPageProvider,
  useBookingPageContext
} from '@/app/[trainId]/[seatNumber]/context';
import { CreateBookingFormProps } from './components/CreateBookingForm/CreateBookingForm';
import { Booking as BookingType } from 'railway-ticketing-app-sdk';
import { BookingInfoProps } from './components/BookingInfo/BookingInfo';
import { CancelBookingButtonProps } from './components/CancelBookingButton/CancelBookingButton';
import { HeaderProps } from './components/Header/Header';
import userEvent from '@testing-library/user-event';
import { MouseEventHandler } from 'react';
import { toast } from 'sonner';

jest.mock('./components/BookingDataSkeleton/BookingDataSkeleton', () => ({
  BookingDataSkeleton: () => (
    <div data-testid="booking-skeleton">Loading...</div>
  )
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('./components/CreateBookingForm/CreateBookingForm', () => ({
  CreateBookingForm: ({
    onSuccess,
    onError
  }: Pick<CreateBookingFormProps, 'onSuccess' | 'onError'>) => (
    <div data-testid="create-booking-form">
      <button
        onClick={() =>
          onSuccess({ bookingId: 'new-booking-123' } as BookingType)
        }
      >
        Create Booking
      </button>
      <button onClick={onError}>Trigger Error</button>
    </div>
  )
}));

jest.mock('./components/BookingInfo/BookingInfo', () => ({
  BookingInfo: ({ bookingInfo }: BookingInfoProps) => (
    <div data-testid="booking-info">{bookingInfo.bookingId}</div>
  )
}));

jest.mock('./components/PassengerInfo/PassengerInfo', () => ({
  PassengerInfo: () => <div data-testid="passenger-info">Passenger Details</div>
}));

jest.mock('./components/CancelBookingButton/CancelBookingButton', () => ({
  CancelBookingButton: ({
    onSuccess,
    onError
  }: Pick<CancelBookingButtonProps, 'onError' | 'onSuccess'>) => (
    <div data-testid="cancel-booking">
      <button
        onClick={onSuccess as unknown as MouseEventHandler<HTMLButtonElement>}
      >
        Cancel Booking
      </button>
      <button onClick={onError}>Trigger Cancel Error</button>
    </div>
  )
}));

jest.mock('./components/Header/Header', () => ({
  Header: ({ bookingId }: HeaderProps) => (
    <div data-testid="header">{bookingId || 'No Booking'}</div>
  )
}));

jest.mock('./components/TrainInfo/TrainInfo', () => ({
  TrainInfo: () => <div data-testid="train-info">Train Information</div>
}));

jest.mock('@/hooks/useBreakpoint/useBreakpoint', () => ({
  useBreakpoint: jest.fn()
}));

jest.mock('@/app/[trainId]/[seatNumber]/context', () => ({
  ...jest.requireActual('@/app/[trainId]/[seatNumber]/context'),
  useBookingPageContext: jest.fn().mockReturnValue({
    bookingData: {},
    isBookingLoading: false,
    updateBooking: jest.fn()
  })
}));

const useBookingPageContextMock = useBookingPageContext as jest.MockedFunction<
  typeof useBookingPageContext
>;
const useBreakpointMock = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

const renderComponent = (trainPageData: TrainPageData, seatNumber: string) =>
  render(
    <TrainPageProvider pageData={trainPageData}>
      <BookingPageProvider seatNumber={seatNumber}>
        <Booking seatNumber={seatNumber} />
      </BookingPageProvider>
    </TrainPageProvider>
  );

describe('Booking component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBreakpointMock.mockReturnValue({ xl: true } as BreakpointState);
  });

  it('should show demo notice for small screen', () => {
    useBreakpointMock.mockReturnValue({ xl: false } as BreakpointState);

    const { container } = renderComponent(null, '1');

    expect(container).toMatchSnapshot();
  });

  it('should render loading state when booking data is loading', () => {
    useBookingPageContextMock.mockReturnValue({
      bookingData: undefined,
      isBookingLoading: true,
      updateBooking: jest.fn()
    });

    renderComponent(null, '1');

    expect(screen.getByTestId('booking-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('train-info')).toBeInTheDocument();
  });

  it('should render create booking form when no booking exists', () => {
    useBookingPageContextMock.mockReturnValue({
      bookingData: null,
      isBookingLoading: false,
      updateBooking: jest.fn()
    });

    renderComponent(null, '1');

    expect(screen.getByTestId('create-booking-form')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('train-info')).toBeInTheDocument();
  });

  it('should render booking info when booking exists', () => {
    const mockBookingData = {
      bookingId: 'booking-123',
      passengerDetails: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    } as BookingType;

    useBookingPageContextMock.mockReturnValue({
      bookingData: mockBookingData,
      isBookingLoading: false,
      updateBooking: jest.fn()
    });

    renderComponent(null, '1');

    expect(screen.getByTestId('booking-info')).toBeInTheDocument();
    expect(screen.getByTestId('passenger-info')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-booking')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent('booking-123');
  });

  it('should handle booking creation success', async () => {
    const mockUpdateBooking = jest.fn();
    useBookingPageContextMock.mockReturnValue({
      bookingData: null,
      isBookingLoading: false,
      updateBooking: mockUpdateBooking
    });

    renderComponent(null, '2');

    const createButton = screen.getByText('Create Booking');
    await userEvent.click(createButton);

    expect(mockUpdateBooking).toHaveBeenCalledWith(2, 'new-booking-123', {
      bookingId: 'new-booking-123'
    });
    expect(toast.success).toHaveBeenCalledWith('Booking successfully created!');
  });

  it('should handle booking creation error', async () => {
    useBookingPageContextMock.mockReturnValue({
      bookingData: null,
      isBookingLoading: false,
      updateBooking: jest.fn()
    });

    renderComponent(null, '2');

    const errorButton = screen.getByText('Trigger Error');
    await userEvent.click(errorButton);

    expect(toast.error).toHaveBeenCalledWith(
      'Failed to create booking, please try again later'
    );
  });

  it('should handle booking cancellation success', async () => {
    const mockUpdateBooking = jest.fn();
    const mockBookingData = {
      bookingId: 'booking-123',
      passengerDetails: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    } as BookingType;

    useBookingPageContextMock.mockReturnValue({
      bookingData: mockBookingData,
      isBookingLoading: false,
      updateBooking: mockUpdateBooking
    });

    renderComponent(null, '3');

    const cancelButton = screen.getByText('Cancel Booking');
    await userEvent.click(cancelButton);

    expect(mockUpdateBooking).toHaveBeenCalledWith(3, undefined, null);
    expect(toast.success).toHaveBeenCalledWith(
      'Booking successfully cancelled!'
    );
  });

  it('should handle booking cancellation error', async () => {
    const mockBookingData = {
      bookingId: 'booking-123',
      passengerDetails: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    } as BookingType;

    useBookingPageContextMock.mockReturnValue({
      bookingData: mockBookingData,
      isBookingLoading: false,
      updateBooking: jest.fn()
    });

    renderComponent(null, '3');

    const errorButton = screen.getByText('Trigger Cancel Error');
    await userEvent.click(errorButton);

    expect(toast.error).toHaveBeenCalledWith(
      'Failed to cancel booking, please try again later'
    );
  });
});
