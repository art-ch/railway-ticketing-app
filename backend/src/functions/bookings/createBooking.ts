import { APIGatewayProxyHandler } from 'aws-lambda';
import jsonBodyParser from '@middy/http-json-body-parser';

import { addBooking } from '../../core/booking';
import { middyApiGateway } from '../../infra/http/middy';
import { HttpError } from '../../infra/errors';
import { CreateBookingDto } from '../../core/dto/bookings.dto';
import { respondOk } from '../../infra/http/utils';

export const createBooking: APIGatewayProxyHandler = async ({ body }) => {
  if (!body) {
    throw new HttpError({
      statusCode: 400,
      message: 'Request body is required'
    });
  }

  const bookingData = CreateBookingDto.parse(JSON.parse(body));
  const booking = await addBooking(bookingData);

  return respondOk(booking);
};

export const handler = middyApiGateway(createBooking).use(jsonBodyParser());
