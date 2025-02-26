import { axiosInstance } from '@/api/axios/axios';
import { Train } from '@/models';

export const fetchTrain = async (
  trainId: Train['trainId']
): Promise<Train | null> => {
  try {
    const response = await axiosInstance.get(`/trains/${trainId}`);

    return JSON.parse(response.data).data || null;
  } catch (error) {
    console.log(error);

    return null;
  }
};
