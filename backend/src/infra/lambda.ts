import { LambdaClient } from '@aws-sdk/client-lambda';
import memoize from 'lodash/memoize';

export const getLambdaClient = memoize(() => new LambdaClient({}));
