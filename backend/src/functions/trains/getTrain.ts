import { APIGatewayProxyHandler } from 'aws-lambda';
import { findTrainById } from '../../core/trains';
import { HttpError } from '../../infra/errors';
import { GetTrainDto } from '../../core/dto/trains.dto';
import { respondOk } from '../../infra/http/utils';
import { middyApiGateway } from '../../infra/http/middy';

export const getTrain: APIGatewayProxyHandler = async ({ pathParameters }) => {
  const { trainId } = GetTrainDto.parse(pathParameters || {});

  const train = await findTrainById(trainId);

  if (!train) {
    throw new HttpError({
      statusCode: 404,
      message: 'Train not found'
    });
  }

  return respondOk(train);
};

export const handler = middyApiGateway(getTrain);
