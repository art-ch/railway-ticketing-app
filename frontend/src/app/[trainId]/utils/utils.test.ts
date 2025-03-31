import { fetchTrain } from './utils';
import { axiosInstance } from '@/api/axios/axios';
import { Train } from 'railway-ticketing-app-sdk';

jest.mock('@/api/axios/axios', () => ({
  axiosInstance: {
    get: jest.fn()
  }
}));

const axiosInstanceGetMock = axiosInstance.get as jest.Mock;

describe('fetchTrain', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  it('should fetch train data successfully', async () => {
    const mockTrainId = '12345';
    const mockTrainData = {
      trainId: mockTrainId
    } as Train;

    axiosInstanceGetMock.mockResolvedValueOnce({
      data: {
        data: mockTrainData
      }
    });

    const result = await fetchTrain(mockTrainId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/trains/${mockTrainId}`);
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTrainData);
  });

  it('should return null when API returns no data', async () => {
    const mockTrainId = '12345';

    axiosInstanceGetMock.mockResolvedValueOnce({
      data: {}
    });

    const result = await fetchTrain(mockTrainId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/trains/${mockTrainId}`);
    expect(result).toBeNull();
  });

  it('should return null and log error when API call fails', async () => {
    const mockTrainId = '12345';
    const mockError = new Error('Network error');

    axiosInstanceGetMock.mockRejectedValueOnce(mockError);

    const result = await fetchTrain(mockTrainId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/trains/${mockTrainId}`);
    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(result).toBeNull();
  });
});
