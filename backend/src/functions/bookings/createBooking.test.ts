import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { createBooking, handler } from './createBooking';
import { addBooking } from '../../core/booking';
import { CreateBookingDto } from '../../core/dto/bookings.dto';
import { HttpError } from '../../infra/errors';
import { respondOk } from '../../infra/http/utils';

jest.mock('../../core/booking');
jest.mock('../../core/dto/bookings.dto');
jest.mock('../../infra/http/utils');

const addBookingMock = addBooking as jest.Mock;
const respondOkMock = respondOk as jest.Mock;

describe('createBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = {} as Callback;

  it('should throw HttpError when body is missing', async () => {
    const event = { body: null } as APIGatewayProxyEvent;

    await expect(createBooking(event, context, callback)).rejects.toThrow(
      HttpError
    );
    await expect(createBooking(event, context, callback)).rejects.toMatchObject(
      {
        statusCode: 400,
        message: 'Request body is required'
      }
    );
  });

  it('should validate request body using CreateBookingDto', async () => {
    const mockBody = { someData: 'value' };
    const event = { body: mockBody } as unknown as APIGatewayProxyEvent;
    const parsedData = { ...mockBody, parsed: true };

    CreateBookingDto.parse = jest.fn().mockReturnValue(parsedData);
    addBookingMock.mockResolvedValue({ id: '123', ...parsedData });
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify({ id: '123', ...parsedData })
    });

    await createBooking(event, context, callback);

    expect(CreateBookingDto.parse).toHaveBeenCalledWith(mockBody);
  });

  it('should call addBooking with parsed data', async () => {
    const mockBody = { someData: 'value' };
    const event = { body: mockBody } as unknown as APIGatewayProxyEvent;
    const parsedData = { ...mockBody, parsed: true };

    CreateBookingDto.parse = jest.fn().mockReturnValue(parsedData);
    addBookingMock.mockResolvedValue({ id: '123', ...parsedData });
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify({ id: '123', ...parsedData })
    });

    await createBooking(event, context, callback);

    expect(addBooking).toHaveBeenCalledWith(parsedData);
  });

  it('should return successful response with booking data', async () => {
    const mockBody = { someData: 'value' };
    const event = { body: mockBody } as unknown as APIGatewayProxyEvent;
    const parsedData = { ...mockBody, parsed: true };
    const bookingResult = { id: '123', ...parsedData };

    CreateBookingDto.parse = jest.fn().mockReturnValue(parsedData);
    addBookingMock.mockResolvedValue(bookingResult);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(bookingResult)
    });

    const result = await createBooking(event, context, callback);

    expect(respondOk).toHaveBeenCalledWith(bookingResult);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(bookingResult)
    });
  });

  it('should propagate validation errors from CreateBookingDto', async () => {
    const mockBody = { invalidData: true };
    const event = { body: mockBody } as unknown as APIGatewayProxyEvent;
    const validationError = new Error('Validation failed');

    CreateBookingDto.parse = jest.fn().mockImplementation(() => {
      throw validationError;
    });

    await expect(createBooking(event, context, callback)).rejects.toThrow(
      validationError
    );
    expect(addBooking).not.toHaveBeenCalled();
  });

  it('should propagate errors from addBooking', async () => {
    const mockBody = { someData: 'value' };
    const event = { body: mockBody } as unknown as APIGatewayProxyEvent;
    const parsedData = { ...mockBody, parsed: true };
    const bookingError = new Error('Failed to add booking');

    CreateBookingDto.parse = jest.fn().mockReturnValue(parsedData);
    addBookingMock.mockRejectedValue(bookingError);

    await expect(createBooking(event, context, callback)).rejects.toThrow(
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
