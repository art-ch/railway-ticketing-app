import { axiosInstance } from '@/api/axios/axios';
import { Train } from '@/models';

export const fetchTrainList = async (): Promise<Train[]> => {
  try {
    const response = await axiosInstance.get('/trains');

    return response.data.data || [];
  } catch (error) {
    console.error(error);

    return [];
  }
};
