import { getTrains } from '../../core/trains';
import { respondOk } from '../../infra/http/utils';
import { middyApiGateway } from '../../infra/http/middy';
import { APIGatewayHandler } from '../../infra/http/types';

export const listTrains: APIGatewayHandler = async () => {
  const trains = await getTrains();
  return respondOk(trains);
};

export const handler = middyApiGateway(listTrains);
