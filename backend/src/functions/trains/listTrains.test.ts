import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { listTrains, handler } from './listTrains';
import { getTrains } from '../../core/trains';
import { respondOk } from '../../infra/http/utils';

jest.mock('../../core/trains');
jest.mock('../../infra/http/utils');

const getTrainsMock = getTrains as jest.Mock;
const respondOkMock = respondOk as jest.Mock;

describe('listTrains', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const context = {} as Context;
  const callback = {} as Callback;
  const event = {} as APIGatewayProxyEvent;

  it('should call getTrains function', async () => {
    const mockTrains = [
      { id: 'train-123', name: 'Express 123' },
      { id: 'train-456', name: 'Local 456' }
    ];
    getTrainsMock.mockResolvedValue(mockTrains);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTrains)
    });

    await listTrains(event, context, callback);

    expect(getTrains).toHaveBeenCalled();
  });

  it('should return successful response with trains data', async () => {
    const mockTrains = [
      { id: 'train-123', name: 'Express 123' },
      { id: 'train-456', name: 'Local 456' }
    ];
    getTrainsMock.mockResolvedValue(mockTrains);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTrains)
    });

    const result = await listTrains(event, context, callback);

    expect(respondOk).toHaveBeenCalledWith(mockTrains);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockTrains)
    });
  });

  it('should return empty array when no trains are found', async () => {
    const mockTrains: any[] = [];
    getTrainsMock.mockResolvedValue(mockTrains);
    respondOkMock.mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTrains)
    });

    const result = await listTrains(event, context, callback);

    expect(respondOk).toHaveBeenCalledWith(mockTrains);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockTrains)
    });
  });

  it('should propagate errors from getTrains', async () => {
    const trainError = new Error('Database error');
    getTrainsMock.mockRejectedValue(trainError);

    await expect(listTrains(event, context, callback)).rejects.toThrow(
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
