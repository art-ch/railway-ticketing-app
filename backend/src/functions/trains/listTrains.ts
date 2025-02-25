import { APIGatewayProxyHandler } from 'aws-lambda';
import { getTrains } from '../../core/trains';
import { respondOk } from '../../infra/http/utils';
import { middyApiGateway } from '../../infra/http/middy';

export const listTrains: APIGatewayProxyHandler = async () => {
  const trains = await getTrains();
  return respondOk(trains);
};

export const handler = middyApiGateway(listTrains);
