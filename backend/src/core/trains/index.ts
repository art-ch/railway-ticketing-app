import { Train, TrainSchema } from '../models';
import { getDynamoDBDocClient } from '../../infra/dynamodb';

const TABLE_NAME = 'TrainsTable';

export const findTrainById = async (trainId: string): Promise<Train | null> => {
  const docClient = getDynamoDBDocClient();

  const result = await docClient.get({
    TableName: TABLE_NAME,
    Key: { trainId }
  });

  if (!result.Item) {
    return null;
  }

  return TrainSchema.parse(result.Item);
};

export const getTrains = async (): Promise<Train[]> => {
  const docClient = getDynamoDBDocClient();

  const result = await docClient.scan({
    TableName: TABLE_NAME
  });

  return (result.Items || []).map((item) => TrainSchema.parse(item));
};

export const updateTrain = async (train: Train): Promise<void> => {
  const docClient = getDynamoDBDocClient();

  await docClient.put({
    TableName: TABLE_NAME,
    Item: train
  });
};
