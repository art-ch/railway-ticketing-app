import { APIGatewayProxyEvent, Handler } from 'aws-lambda';

export type APIGatewayHandlerResponse = {
  statusCode: number;
  body: unknown;
};

export type APIGatewayHandler = Handler<
  APIGatewayProxyEvent,
  APIGatewayHandlerResponse
>;
