import { APIGatewayProxyEvent, Handler } from 'aws-lambda';

type APIGatewayHandlerResponse = {
  statusCode: number;
  body: unknown;
};

export type APIGatewayHandler = Handler<
  APIGatewayProxyEvent,
  APIGatewayHandlerResponse
>;
