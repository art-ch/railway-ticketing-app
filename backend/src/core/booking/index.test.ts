import { v4 as uuid } from 'uuid';
import { Booking } from 'railway-ticketing-app-sdk';
import { addBooking, findBookingById, changeBookingStatus } from './index';
import { findTrainById, updateTrain } from '../trains';
import { getDynamoDBDocClient } from '../../infra/dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { faker } from '@faker-js/faker';

jest.mock('uuid');
jest.mock('../trains');
jest.mock('../../infra/dynamodb');

const uuidMock = uuid as jest.MockedFn<typeof uuid>;
const getDynamoDBDocClientMock = getDynamoDBDocClient as jest.MockedFn<
  typeof getDynamoDBDocClient
>;

describe('Booking Functions', () => {
  const mockUuid = faker.string.uuid();
  const mockDate = '2023-01-01T12:00:00Z';
  let originalDateNow: () => number;

  // Mock data
  const mockTrain = {
    trainId: faker.string.uuid(),
    name: 'Express 123',
    seats: [
      { seatNumber: 1, isBooked: false },
      { seatNumber: 2, isBooked: true, bookingId: 'existing-booking' }
    ]
  };

  const mockBookingData = {
    trainId: mockTrain.trainId,
    seatNumber: 1,
    passengerDetails: {
      name: 'gjkdasjglk',
      email: 'dgsaklj@gmail.com',
      phone: '76429764326'
    }
  } as unknown as Booking;

  const mockBooking = {
    ...mockBookingData,
    bookingId: mockUuid,
    status: 'CONFIRMED',
    bookingTime: mockDate
  } as unknown as Booking;

  beforeAll(() => {
    originalDateNow = Date.now;
    global.Date.now = jest.fn(() => new Date(mockDate).getTime());
    jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue(mockDate);
  });

  afterAll(() => {
    global.Date.now = originalDateNow;
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    uuidMock.mockReturnValue(mockUuid);
    (findTrainById as jest.Mock).mockResolvedValue(mockTrain);
    (updateTrain as jest.Mock).mockResolvedValue(mockTrain);

    const mockDocClient = {
      put: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({ Item: mockBooking })
    } as unknown as DynamoDBDocument;

    getDynamoDBDocClientMock.mockReturnValue(mockDocClient);
  });

  describe('addBooking', () => {
    it('should successfully create a booking', async () => {
      const result = await addBooking(mockBookingData);

      // Check result
      expect(result).toEqual(mockBooking);

      // Verify train was checked
      expect(findTrainById).toHaveBeenCalledWith(mockBookingData.trainId);

      // Verify booking was saved to DynamoDB
      const docClient = getDynamoDBDocClient();
      expect(docClient.put).toHaveBeenCalledWith({
        TableName: 'BookingsTable',
        Item: mockBooking
      });

      // Verify train seat was updated
      expect(updateTrain).toHaveBeenCalled();
      const updateTrainArg = (updateTrain as jest.Mock).mock.calls[0][0];
      expect(updateTrainArg.seats[0].isBooked).toBe(true);
      expect(updateTrainArg.seats[0].bookingId).toBe(mockUuid);
    });

    it('should throw error if train not found', async () => {
      (findTrainById as jest.Mock).mockResolvedValue(null);

      await expect(addBooking(mockBookingData)).rejects.toThrow(
        'Train not found'
      );

      // Verify no booking was saved
      const docClient = getDynamoDBDocClient();
      expect(docClient.put).not.toHaveBeenCalled();
    });

    it('should throw error if seat is already booked', async () => {
      // Try to book seat #2 which is already booked
      await expect(
        addBooking({ ...mockBookingData, seatNumber: 2 })
      ).rejects.toThrow('Seat is already booked');

      // Verify no booking was saved
      const docClient = getDynamoDBDocClient();
      expect(docClient.put).not.toHaveBeenCalled();
    });
  });

  describe('findBookingById', () => {
    it('should return booking when found', async () => {
      const result = await findBookingById(mockUuid);

      expect(result).toEqual(mockBooking);

      const docClient = getDynamoDBDocClient();
      expect(docClient.get).toHaveBeenCalledWith({
        TableName: 'BookingsTable',
        Key: { bookingId: mockUuid }
      });
    });

    it('should return null when booking not found', async () => {
      const docClient = getDynamoDBDocClient();
      (docClient.get as jest.Mock).mockResolvedValue({ Item: null });

      const result = await findBookingById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should validate booking data with schema', async () => {
      const docClient = getDynamoDBDocClient();
      // Return invalid booking data
      (docClient.get as jest.Mock).mockResolvedValue({
        Item: { bookingId: 'invalid-booking' }
      });

      // This should throw because the returned data doesn't match BookingSchema
      await expect(findBookingById('invalid-booking')).rejects.toThrow();
    });
  });

  describe('changeBookingStatus', () => {
    it('should update booking status', async () => {
      const updatedBooking = { ...mockBooking, status: 'CONFIRMED' };

      const result = await changeBookingStatus(mockUuid, 'CONFIRMED');

      expect(result).toEqual(updatedBooking);

      const docClient = getDynamoDBDocClient();
      expect(docClient.put).toHaveBeenCalledWith({
        TableName: 'BookingsTable',
        Item: updatedBooking
      });

      // Verify train seat was NOT updated (only happens for CANCELLED)
      expect(updateTrain).not.toHaveBeenCalled();
    });

    it('should throw error if booking not found', async () => {
      const docClient = getDynamoDBDocClient();
      (docClient.get as jest.Mock).mockResolvedValue({ Item: null });

      await expect(
        changeBookingStatus('non-existent-id', 'CANCELLED')
      ).rejects.toThrow('Booking not found');

      expect(docClient.put).not.toHaveBeenCalled();
    });

    it('should free up seat when status is CANCELLED', async () => {
      await changeBookingStatus(mockUuid, 'CANCELLED');

      // Verify train seat was updated
      expect(updateTrain).toHaveBeenCalled();
      const updateTrainArg = (updateTrain as jest.Mock).mock.calls[0][0];
      expect(updateTrainArg.seats[0].isBooked).toBe(false);
      expect(updateTrainArg.seats[0].bookingId).toBeUndefined();
    });

    it('should handle case when train not found during cancellation', async () => {
      (findTrainById as jest.Mock).mockResolvedValue(null);

      // Should not throw error even if train not found
      await expect(
        changeBookingStatus(mockUuid, 'CANCELLED')
      ).resolves.toBeDefined();

      // Booking should still be updated
      const docClient = getDynamoDBDocClient();
      expect(docClient.put).toHaveBeenCalled();

      // But train update should not be attempted
      expect(updateTrain).not.toHaveBeenCalled();
    });
  });
});
