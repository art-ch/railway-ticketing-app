import middy, { MiddlewareObj } from '@middy/core';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpResponseSerializer from '@middy/http-response-serializer';
import httpUrlencodePathParametersParser from '@middy/http-urlencode-path-parser';
import { ZodError } from 'zod';
import { HttpError } from '../errors';
import { respondError } from './utils';
import { APIGatewayHandler } from './types';

const httpErrorHandler = (): MiddlewareObj => ({
  onError: (request) => {
    const { error, response } = request;
    const errorMeta = {
      // We might not have authorizer in our case yet
      // claims: { userId: event.requestContext.authorizer?.lambda?.jwt?.claims?.global_id },
    };

    if (!error) {
      request.response = {
        ...response,
        ...respondError(500, [{ title: 'Unknown error' }], errorMeta)
      };
    } else if (error instanceof ZodError) {
      request.response = {
        ...response,
        ...respondError(
          400,
          error.issues.map((issue) => ({
            title: issue.message,
            meta: { ...issue }
          })),
          errorMeta
        )
      };
    } else if (error instanceof HttpError) {
      request.response = {
        ...response,
        ...respondError(error.statusCode, [{ title: error.message }], errorMeta)
      };
    } else {
      request.response = {
        ...response,
        ...respondError(500, [{ title: error.message }], errorMeta)
      };
    }
  }
});

export const middyApiGateway = (handler: APIGatewayHandler) => {
  return middy(handler)
    .use(doNotWaitForEmptyEventLoop())
    .use(httpEventNormalizer())
    .use(httpHeaderNormalizer())
    .use(
      httpResponseSerializer({
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body)
          }
        ],
        defaultContentType: 'application/json'
      })
    )
    .use(httpUrlencodePathParametersParser())
    .use(httpErrorHandler());
};
