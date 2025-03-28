import { axiosInstance } from '@/api/axios/axios';
import { Train } from 'railway-ticketing-app-sdk';

export const fetchTrain = async (
  trainId: Train['trainId']
): Promise<Train | null> => {
  try {
    const response = await axiosInstance.get(`/trains/${trainId}`);

    return response.data.data || null;
  } catch (error) {
    console.error(error);

    return null;
  }
};
