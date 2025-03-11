import { findBookingById } from '../../core/booking';
import { GetBookingDto } from '../../core/dto/bookings.dto';
import { middyApiGateway } from '../../infra/http/middy';
import { HttpError } from '../../infra/errors';
import { respondOk } from '../../infra/http/utils';
import { APIGatewayHandler } from '../../infra/http/types';

export const getBooking: APIGatewayHandler = async ({ pathParameters }) => {
  const { bookingId } = GetBookingDto.parse(pathParameters || {});

  const booking = await findBookingById(bookingId);

  if (!booking) {
    throw new HttpError({
      statusCode: 404,
      message: 'Booking not found'
    });
  }

  return respondOk(booking);
};

export const handler = middyApiGateway(getBooking);
