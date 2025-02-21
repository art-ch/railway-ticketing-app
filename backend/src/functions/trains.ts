import { APIGatewayProxyHandler } from 'aws-lambda';
import { findTrainById, listTrains } from '../core/trains';

export const getTrainHandler: APIGatewayProxyHandler = async (event) => {
  // implementation will come later
};

export const listTrainsHandler: APIGatewayProxyHandler = async (event) => {
  // implementation will come later
};
