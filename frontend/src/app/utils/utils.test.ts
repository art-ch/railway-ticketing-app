import { fetchTrainList } from './utils';
import { axiosInstance } from '@/api/axios/axios';
import { Train } from 'railway-ticketing-app-sdk';

// Mock the axios instance
jest.mock('@/api/axios/axios', () => ({
  axiosInstance: {
    get: jest.fn()
  }
}));

describe('fetchTrainList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch train list successfully', async () => {
    const mockTrains = [
      {
        trainId: '1',
        name: 'Express 101',
        departureTime: '10:00',
        arrivalTime: '12:00'
      },
      {
        trainId: '2',
        name: 'Local 202',
        departureTime: '14:30',
        arrivalTime: '16:45'
      }
    ] as Train[];

    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: mockTrains
      }
    });

    const result = await fetchTrainList();

    expect(axiosInstance.get).toHaveBeenCalledWith('/trains');
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockTrains);
  });

  it('should return empty array when response data is empty', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: []
      }
    });

    const result = await fetchTrainList();

    expect(axiosInstance.get).toHaveBeenCalledWith('/trains');
    expect(result).toEqual([]);
  });

  it('should return empty array when response data.data is undefined', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: {}
    });

    const result = await fetchTrainList();

    expect(axiosInstance.get).toHaveBeenCalledWith('/trains');
    expect(result).toEqual([]);
  });

  it('should handle network errors and return empty array', async () => {
    const networkError = new Error('Network Error');
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(networkError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await fetchTrainList();

    expect(axiosInstance.get).toHaveBeenCalledWith('/trains');
    expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);
    expect(result).toEqual([]);

    consoleErrorSpy.mockRestore();
  });

  it('should handle server errors and return empty array', async () => {
    const serverError = {
      response: {
        status: 500,
        data: { message: 'Internal Server Error' }
      }
    };
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(serverError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await fetchTrainList();

    expect(axiosInstance.get).toHaveBeenCalledWith('/trains');
    expect(consoleErrorSpy).toHaveBeenCalledWith(serverError);
    expect(result).toEqual([]);

    consoleErrorSpy.mockRestore();
  });
});
