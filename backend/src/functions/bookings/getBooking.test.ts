import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { getBooking, handler } from './getBooking';
import { findBookingById } from '../../core/booking';
import { GetBookingDto } from '../../core/dto/bookings.dto';
import { HttpError } from '../../infra/errors';
import { respondOk } from '../../infra/http/utils';

jest.mock('../../core/booking');
jest.mock('../../core/dto/bookings.dto');
jest.mock('../../infra/http/utils');

const findBookingByIdMock = findBookingById as jest.Mock;
const respondOkMock = respondOk as jest.Mock;

describe('getBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = {} as Callback;

  it('should throw 404 HttpError when booking is not found', async () => {
    const event = {
      pathParameters: { bookingId: 'non-existent-id' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'non-existent-id' });
    findBookingByIdMock.mockResolvedValue(null);

    await expect(getBooking(event, context, callback)).rejects.toThrow(
      HttpError
    );
    await expect(getBooking(event, context, callback)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Booking not found'
    });

    expect(findBookingById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should validate path parameters using GetBookingDto', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' }
    } as unknown as APIGatewayProxyEvent;

    const parsedParams = { bookingId: 'booking-123' };
    GetBookingDto.parse = jest.fn().mockReturnValue(parsedParams);

    const mockBooking = { id: 'booking-123', customerName: 'John Doe' };
    findBookingByIdMock.mockResolvedValue(mockBooking);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockBooking)
    });

    await getBooking(event, context, callback);

    expect(GetBookingDto.parse).toHaveBeenCalledWith({
      bookingId: 'booking-123'
    });
  });

  it('should call findBookingById with the correct id', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });

    const mockBooking = { id: 'booking-123', customerName: 'John Doe' };
    findBookingByIdMock.mockResolvedValue(mockBooking);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockBooking)
    });

    await getBooking(event, context, callback);

    expect(findBookingById).toHaveBeenCalledWith('booking-123');
  });

  it('should return successful response with booking data', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });

    const mockBooking = { id: 'booking-123', customerName: 'John Doe' };
    findBookingByIdMock.mockResolvedValue(mockBooking);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockBooking)
    });

    const result = await getBooking(event, context, callback);

    expect(respondOk).toHaveBeenCalledWith(mockBooking);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockBooking)
    });
  });

  it('should handle null pathParameters', async () => {
    const event = {
      pathParameters: null
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest.fn().mockImplementation(() => {
      throw new Error('Validation failed');
    });

    await expect(getBooking(event, context, callback)).rejects.toThrow();
    expect(findBookingById).not.toHaveBeenCalled();
  });

  it('should propagate validation errors from GetBookingDto', async () => {
    const event = {
      pathParameters: { invalidParam: true }
    } as unknown as APIGatewayProxyEvent;

    const validationError = new Error('Validation failed');
    GetBookingDto.parse = jest.fn().mockImplementation(() => {
      throw validationError;
    });

    await expect(getBooking(event, context, callback)).rejects.toThrow(
      validationError
    );
    expect(findBookingById).not.toHaveBeenCalled();
  });

  it('should propagate errors from findBookingById', async () => {
    const event = {
      pathParameters: { bookingId: 'booking-123' }
    } as unknown as APIGatewayProxyEvent;

    GetBookingDto.parse = jest
      .fn()
      .mockReturnValue({ bookingId: 'booking-123' });

    const bookingError = new Error('Database error');
    findBookingByIdMock.mockRejectedValue(bookingError);

    await expect(getBooking(event, context, callback)).rejects.toThrow(
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
