import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import memoize from 'lodash/memoize';

export const getDynamoDBClient = memoize(() => new DynamoDBClient({}));
