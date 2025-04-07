import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { updateBookingStatus, handler } from './updateBookingStatus';
import { changeBookingStatus } from '../../core/booking';
import {
  GetBookingDto,
  UpdateBookingStatusDto
} from '../../core/dto/bookings.dto';
import { HttpError } from '../../infra/errors';
import { respondOk } from '../../infra/http/utils';

jest.mock('../../core/booking');
jest.mock('../../core/dto/bookings.dto');
jest.mock('../../infra/http/utils');

const changeBookingStatusMock = changeBookingStatus as jest.Mock;
const respondOkMock = respondOk as jest.Mock;

describe('updateBookingStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = {} as Callback;

  it('should throw HttpError when body is missing', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' },
      body: null
    } as unknown as APIGatewayProxyEvent;

    await expect(updateBookingStatus(event, context, callback)).rejects.toThrow(
      HttpError
    );
    await expect(
      updateBookingStatus(event, context, callback)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: 'Request body is required'
    });
  });

  it('should validate path parameters using GetBookingDto', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' },
      body: { status: 'CONFIRMED' }
    } as unknown as APIGatewayProxyEvent;

    const parsedParams = { bookingId: 'booking-123' };
    GetBookingDto.parse = jest.fn().mockReturnValue(parsedParams);

    UpdateBookingStatusDto.parse = jest
      .fn()
      .mockReturnValue({ status: 'CONFIRMED' });

    const updatedBooking = { id: 'booking-123', status: 'CONFIRMED' };
    changeBookingStatusMock.mockResolvedValue(updatedBooking);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(updatedBooking)
    });

    await updateBookingStatus(event, context, callback);

    expect(GetBookingDto.parse).toHaveBeenCalledWith({
      bookingId: 'booking-123'
    });
  });

  it('should validate request body using UpdateBookingStatusDto', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' },
      body: { status: 'CONFIRMED' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });
    UpdateBookingStatusDto.parse = jest
      .fn()
      .mockReturnValue({ status: 'CONFIRMED' });

    const updatedBooking = { id: 'booking-123', status: 'CONFIRMED' };
    changeBookingStatusMock.mockResolvedValue(updatedBooking);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(updatedBooking)
    });

    await updateBookingStatus(event, context, callback);

    expect(UpdateBookingStatusDto.parse).toHaveBeenCalledWith({
      status: 'CONFIRMED'
    });
  });

  it('should call changeBookingStatus with correct parameters', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' },
      body: { status: 'CONFIRMED' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });
    UpdateBookingStatusDto.parse = jest
      .fn()
      .mockReturnValue({ status: 'CONFIRMED' });

    const updatedBooking = { id: 'booking-123', status: 'CONFIRMED' };
    changeBookingStatusMock.mockResolvedValue(updatedBooking);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(updatedBooking)
    });

    await updateBookingStatus(event, context, callback);

    expect(changeBookingStatus).toHaveBeenCalledWith(
      'booking-123',
      'CONFIRMED'
    );
  });

  it('should return successful response with updated booking data', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' },
      body: { status: 'CONFIRMED' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });
    UpdateBookingStatusDto.parse = jest
      .fn()
      .mockReturnValue({ status: 'CONFIRMED' });

    const updatedBooking = { id: 'booking-123', status: 'CONFIRMED' };
    changeBookingStatusMock.mockResolvedValue(updatedBooking);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(updatedBooking)
    });

    const result = await updateBookingStatus(event, context, callback);

    expect(respondOk).toHaveBeenCalledWith(updatedBooking);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(updatedBooking)
    });
  });

  it('should handle null pathParameters', async () => {
    const event = {
      pathParameters: null,
      body: { status: 'CONFIRMED' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest.fn().mockImplementation(() => {
      throw new Error('Validation failed');
    });

    await expect(
      updateBookingStatus(event, context, callback)
    ).rejects.toThrow();
    expect(changeBookingStatus).not.toHaveBeenCalled();
  });

  it('should propagate validation errors from GetBookingDto', async () => {
    const event = {
      pathParameters: { invalidParam: true },
      body: { status: 'CONFIRMED' }
    } as unknown as APIGatewayProxyEvent;

    const validationError = new Error('Path validation failed');
    GetBookingDto.parse = jest.fn().mockImplementation(() => {
      throw validationError;
    });

    await expect(updateBookingStatus(event, context, callback)).rejects.toThrow(
      validationError
    );
    expect(changeBookingStatus).not.toHaveBeenCalled();
  });

  it('should propagate validation errors from UpdateBookingStatusDto', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' },
      body: { invalidStatus: 'WRONG' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });

    const validationError = new Error('Body validation failed');
    UpdateBookingStatusDto.parse = jest.fn().mockImplementation(() => {
      throw validationError;
    });

    await expect(updateBookingStatus(event, context, callback)).rejects.toThrow(
      validationError
    );
    expect(changeBookingStatus).not.toHaveBeenCalled();
  });

  it('should propagate errors from changeBookingStatus', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' },
      body: { status: 'CONFIRMED' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });
    UpdateBookingStatusDto.parse = jest
      .fn()
      .mockReturnValue({ status: 'CONFIRMED' });

    const bookingError = new Error('Failed to update booking status');
    changeBookingStatusMock.mockRejectedValue(bookingError);

    await expect(updateBookingStatus(event, context, callback)).rejects.toThrow(
      bookingError
    );
    expect(respondOk).not.toHaveBeenCalled();
  });
});

describe('handler', () => {
  it('should be defined', () => {
    expect(handler).toBeDefined();
  });
});
