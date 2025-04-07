import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { getTrain, handler } from './getTrain';
import { findTrainById } from '../../core/trains';
import { GetTrainDto } from '../../core/dto/trains.dto';
import { HttpError } from '../../infra/errors';
import { respondOk } from '../../infra/http/utils';

jest.mock('../../core/trains');
jest.mock('../../core/dto/trains.dto');
jest.mock('../../infra/http/utils');

const findTrainByIdMock = findTrainById as jest.Mock;
const respondOkMock = respondOk as jest.Mock;

describe('getTrain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = {} as Callback;

  it('should throw 404 HttpError when train is not found', async () => {
    const event = {
      pathParameters: { trainId: 'non-existent-id' }
    } as unknown as APIGatewayProxyEvent;

    GetTrainDto.parse = jest
      .fn()
      .mockReturnValue({ trainId: 'non-existent-id' });
    findTrainByIdMock.mockResolvedValue(null);

    await expect(getTrain(event, context, callback)).rejects.toThrow(HttpError);
    await expect(getTrain(event, context, callback)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Train not found'
    });

    expect(findTrainById).toHaveBeenCalledWith('non-existent-id');
  });

  it('should validate path parameters using GetTrainDto', async () => {
    const event = {
      pathParameters: { trainId: 'train-123' }
    } as unknown as APIGatewayProxyEvent;

    const parsedParams = { trainId: 'train-123' };
    GetTrainDto.parse = jest.fn().mockReturnValue(parsedParams);

    const mockTrain = { id: 'train-123', name: 'Express 123' };
    findTrainByIdMock.mockResolvedValue(mockTrain);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTrain)
    });

    await getTrain(event, context, callback);

    expect(GetTrainDto.parse).toHaveBeenCalledWith({ trainId: 'train-123' });
  });

  it('should call findTrainById with the correct id', async () => {
    const event = {
      pathParameters: { trainId: 'train-123' }
    } as unknown as APIGatewayProxyEvent;

    GetTrainDto.parse = jest.fn().mockReturnValue({ trainId: 'train-123' });

    const mockTrain = { id: 'train-123', name: 'Express 123' };
    findTrainByIdMock.mockResolvedValue(mockTrain);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTrain)
    });

    await getTrain(event, context, callback);

    expect(findTrainById).toHaveBeenCalledWith('train-123');
  });

  it('should return successful response with train data', async () => {
    const event = {
      pathParameters: { trainId: 'train-123' }
    } as unknown as APIGatewayProxyEvent;

    GetTrainDto.parse = jest.fn().mockReturnValue({ trainId: 'train-123' });

    const mockTrain = { id: 'train-123', name: 'Express 123' };
    findTrainByIdMock.mockResolvedValue(mockTrain);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTrain)
    });

    const result = await getTrain(event, context, callback);

    expect(respondOk).toHaveBeenCalledWith(mockTrain);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockTrain)
    });
  });

  it('should handle null pathParameters', async () => {
    const event = {
      pathParameters: null
    } as unknown as APIGatewayProxyEvent;

    GetTrainDto.parse = jest.fn().mockImplementation(() => {
      throw new Error('Validation failed');
    });

    await expect(getTrain(event, context, callback)).rejects.toThrow();
    expect(findTrainById).not.toHaveBeenCalled();
  });

  it('should propagate validation errors from GetTrainDto', async () => {
    const event = {
      pathParameters: { invalidParam: true }
    } as unknown as APIGatewayProxyEvent;

    const validationError = new Error('Validation failed');
    GetTrainDto.parse = jest.fn().mockImplementation(() => {
      throw validationError;
    });

    await expect(getTrain(event, context, callback)).rejects.toThrow(
      validationError
    );
    expect(findTrainById).not.toHaveBeenCalled();
  });

  it('should propagate errors from findTrainById', async () => {
    const event = {
      pathParameters: { trainId: 'train-123' }
    } as unknown as APIGatewayProxyEvent;

    GetTrainDto.parse = jest.fn().mockReturnValue({ trainId: 'train-123' });

    const trainError = new Error('Database error');
    findTrainByIdMock.mockRejectedValue(trainError);

    await expect(getTrain(event, context, callback)).rejects.toThrow(
      trainError
    );
    expect(respondOk).not.toHaveBeenCalled();
  });
});

describe('handler', () => {
  it('should be defined', () => {
    expect(handler).toBeDefined();
  });
});
