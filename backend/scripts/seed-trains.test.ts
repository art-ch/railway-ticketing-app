import { v4 as uuid } from 'uuid';
import { getDynamoDBDocClient } from '../src/infra/dynamodb';
import * as script from './seed-trains';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

jest.mock('uuid');
jest.mock('../src/infra/dynamodb');

const uuidMock = uuid as jest.Mock;
const getDynamoDBDocClientMock = getDynamoDBDocClient as jest.MockedFunction<
  typeof getDynamoDBDocClient
>;

describe('Train Seeding Script', () => {
  const mockUuid = 'mock-uuid-value';
  const mockPut = jest.fn().mockResolvedValue({});
  const mockDocClient = { put: mockPut } as unknown as DynamoDBDocument;

  beforeEach(() => {
    jest.clearAllMocks();
    uuidMock.mockReturnValue(mockUuid);
    getDynamoDBDocClientMock.mockReturnValue(mockDocClient);

    const mockDate = new Date('2023-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('getTomorrowDate returns the correct format', () => {
    // Since we mocked Date to return 2023-01-01, tomorrow should be 2023-01-02
    expect(script.getTomorrowDate()).toBe('2023-01-02');
  });

  test('generateTrains creates the correct train objects', () => {
    const trains = script.generateTrains();

    // Check if we have the correct number of trains
    expect(trains).toHaveLength(10);

    // Check structure of the first train
    const firstTrain = trains[0];
    expect(firstTrain).toEqual({
      trainId: mockUuid,
      name: 'Morning Express',
      trainType: 'express',
      departureStation: 'London',
      arrivalStation: 'Manchester',
      departureTime: '2023-01-02T06:00:00Z',
      arrivalTime: '2023-01-02T08:30:00Z',
      seats: expect.arrayContaining([
        expect.objectContaining({
          seatNumber: expect.any(Number),
          isBooked: false
        })
      ])
    });

    // Check if all trains have 10 seats
    trains.forEach((train) => {
      expect(train.seats).toHaveLength(10);
      expect(train.seats[0].seatNumber).toBe(1);
      expect(train.seats[9].seatNumber).toBe(10);
    });
  });

  test('seedTrains calls DynamoDB put for each train', async () => {
    await script.seedTrains();

    // Should call put 10 times (once for each train)
    expect(mockPut).toHaveBeenCalledTimes(10);

    // Check if put was called with correct parameters for first train
    expect(mockPut).toHaveBeenCalledWith({
      TableName: 'TrainsTable',
      Item: expect.objectContaining({
        trainId: mockUuid,
        name: 'Morning Express'
      })
    });
  });

  test('seedTrains handles errors properly', async () => {
    // Setup mock to reject
    mockPut.mockRejectedValueOnce(new Error('DynamoDB error'));

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Make sure the function throws when called directly
    await expect(script.seedTrains()).rejects.toThrow('DynamoDB error');

    // Clean up
    consoleSpy.mockRestore();
  });
});
