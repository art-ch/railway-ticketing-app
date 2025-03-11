import {
  GetBookingDto,
  UpdateBookingStatusDto
} from '../../core/dto/bookings.dto';
import { middyApiGateway } from '../../infra/http/middy';
import { HttpError } from '../../infra/errors';
import { changeBookingStatus } from '../../core/booking';
import { respondOk } from '../../infra/http/utils';
import jsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayHandler } from '../../infra/http/types';

export const updateBookingStatus: APIGatewayHandler = async ({
  pathParameters,
  body
}) => {
  if (!body) {
    throw new HttpError({
      statusCode: 400,
      message: 'Request body is required'
    });
  }

  const { bookingId } = GetBookingDto.parse(pathParameters || {});
  const { status } = UpdateBookingStatusDto.parse(body);

  const booking = await changeBookingStatus(bookingId, status);

  return respondOk(booking);
};

export const handler = middyApiGateway(updateBookingStatus).use(
  jsonBodyParser()
);
