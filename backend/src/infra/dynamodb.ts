import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import memoize from 'lodash/memoize';

export const getDynamoDBClient = memoize(
  () =>
    new DynamoDBClient({
      region: 'eu-north-1'
    })
);

export const getDynamoDBDocClient = memoize(() =>
  DynamoDBDocument.from(getDynamoDBClient())
);
