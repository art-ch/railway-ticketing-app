import { axiosInstance } from '@/api/axios/axios';
import { Train } from '@/models';

export const fetchTrainList = async (): Promise<Train[]> => {
  try {
    const response = await axiosInstance.get('/trains');

    return JSON.parse(response.data).data || [];
  } catch (error) {
    console.log(error);

    return [];
  }
};
