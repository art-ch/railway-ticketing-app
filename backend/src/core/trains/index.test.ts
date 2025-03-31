import { Train, TrainSchema } from 'railway-ticketing-app-sdk';
import { getDynamoDBDocClient } from '../../infra/dynamodb';
import { findTrainById, getTrains, updateTrain } from './index';
import { faker } from '@faker-js/faker/.';

jest.mock('../../infra/dynamodb');

describe('Train Functions', () => {
  const mockTrain: Train = {
    trainId: faker.string.uuid(),
    trainType: 'local',
    name: 'Express 123',
    departureStation: 'London',
    arrivalStation: 'Manchester',
    departureTime: faker.date.recent().toISOString(),
    arrivalTime: faker.date.recent().toISOString(),
    seats: Array.from({ length: 10 }).map((_, id) => ({
      seatNumber: id + 1,
      isBooked: false
    }))
  };

  const mockTrains: Train[] = [
    mockTrain,
    {
      trainId: faker.string.uuid(),
      trainType: 'local',
      name: 'Express 456',
      departureStation: 'Manchester',
      arrivalStation: 'Edinburgh',
      departureTime: faker.date.recent().toISOString(),
      arrivalTime: faker.date.recent().toISOString(),
      seats: Array.from({ length: 10 }).map((_, id) => ({
        seatNumber: id + 1,
        isBooked: false
      }))
    }
  ];

  const mockGet = jest.fn();
  const mockScan = jest.fn();
  const mockPut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (getDynamoDBDocClient as unknown as jest.Mock).mockReturnValue({
      get: mockGet,
      scan: mockScan,
      put: mockPut
    });
  });

  describe('findTrainById', () => {
    it('should return a train when found', async () => {
      mockGet.mockResolvedValue({ Item: mockTrain });

      const result = await findTrainById('train-123');

      expect(result).toEqual(mockTrain);
      expect(mockGet).toHaveBeenCalledWith({
        TableName: 'TrainsTable',
        Key: { trainId: 'train-123' }
      });
    });

    it('should return null when train is not found', async () => {
      mockGet.mockResolvedValue({ Item: undefined });

      const result = await findTrainById('non-existent-train');

      expect(result).toBeNull();
      expect(mockGet).toHaveBeenCalledWith({
        TableName: 'TrainsTable',
        Key: { trainId: 'non-existent-train' }
      });
    });

    it('should throw an error when TrainSchema validation fails', async () => {
      const invalidTrain = { trainId: 'train-123' }; // Missing required fields
      mockGet.mockResolvedValue({ Item: invalidTrain });

      await expect(findTrainById('train-123')).rejects.toThrow();
    });
  });

  describe('getTrains', () => {
    it('should return all trains', async () => {
      mockScan.mockResolvedValue({ Items: mockTrains });

      const result = await getTrains();

      expect(result).toEqual(mockTrains);
      expect(mockScan).toHaveBeenCalledWith({
        TableName: 'TrainsTable'
      });
    });

    it('should return empty array when no trains exist', async () => {
      mockScan.mockResolvedValue({ Items: [] });

      const result = await getTrains();

      expect(result).toEqual([]);
      expect(mockScan).toHaveBeenCalledWith({
        TableName: 'TrainsTable'
      });
    });

    it('should handle undefined Items in scan result', async () => {
      mockScan.mockResolvedValue({ Items: undefined });

      const result = await getTrains();

      expect(result).toEqual([]);
    });

    it('should throw an error when TrainSchema validation fails', async () => {
      const invalidTrains = [{ trainId: 'train-123' }]; // Missing required fields
      mockScan.mockResolvedValue({ Items: invalidTrains });

      await expect(getTrains()).rejects.toThrow();
    });
  });

  describe('updateTrain', () => {
    it('should update a train successfully', async () => {
      mockPut.mockResolvedValue({});

      await updateTrain(mockTrain);

      expect(mockPut).toHaveBeenCalledWith({
        TableName: 'TrainsTable',
        Item: mockTrain
      });
    });

    it('should propagate errors from DynamoDB', async () => {
      const error = new Error('DynamoDB error');
      mockPut.mockRejectedValue(error);

      await expect(updateTrain(mockTrain)).rejects.toThrow('DynamoDB error');
    });
  });
});
