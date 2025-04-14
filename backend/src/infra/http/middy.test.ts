import { z, ZodError, ZodIssue } from 'zod';
import { HttpError } from '../errors';
import { middyApiGateway } from './middy';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { APIGatewayHandler, APIGatewayHandlerResponse } from './types';
import { Event as HeaderNormalizerEvent } from '@middy/http-header-normalizer';
import { Event as EventNormalizerEvent } from '@middy/http-event-normalizer';
import { Event as UrlEncodeEvent } from '@middy/http-urlencode-path-parser';
import { MiddyHandlerObject } from '@middy/core';

jest.mock('@middy/do-not-wait-for-empty-event-loop', () =>
  jest.fn(() => ({ before: jest.fn(), after: jest.fn() }))
);
jest.mock('@middy/http-event-normalizer', () =>
  jest.fn(() => ({ before: jest.fn() }))
);
jest.mock('@middy/http-header-normalizer', () =>
  jest.fn(() => ({ before: jest.fn() }))
);
jest.mock('@middy/http-response-serializer', () =>
  jest.fn(() => ({ after: jest.fn() }))
);
jest.mock('@middy/http-urlencode-path-parser', () =>
  jest.fn(() => ({ before: jest.fn() }))
);

/**
 * MiddyEvent represents the event object after it has been processed by all middleware in the chain.
 *
 * In a Middy middleware chain, each middleware transforms the event by adding or modifying properties:
 * - HeaderNormalizerEvent: Adds 'rawHeaders' property from @middy/http-header-normalizer
 * - EventNormalizerEvent: Ensures query parameters, headers, etc. are always defined from @middy/http-event-normalizer
 * - UrlEncodeEvent: Adds decoded URL path parameters from @middy/http-urlencode-path-parser
 * - APIGatewayProxyEvent: The base AWS Lambda event structure
 *
 * When testing middleware, we need to mock an event that has already gone through all these transformations,
 * as that's what our handler function expects to receive. This combined type ensures TypeScript understands
 * that our mock event includes all properties that would be added by the middleware chain.
 */
type MiddyEvent = HeaderNormalizerEvent &
  EventNormalizerEvent &
  UrlEncodeEvent &
  APIGatewayProxyEvent;

describe('Middleware Tests', () => {
  let mockHandler: jest.MockedFunction<APIGatewayHandler>;
  let mockEvent: MiddyEvent;
  let mockContext: Context;
  let mockCallback: MiddyHandlerObject;

  beforeEach(() => {
    mockHandler = jest.fn() as jest.MockedFunction<APIGatewayHandler>;
    mockEvent = {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
      // Add all required properties for middleware
      rawHeaders: {},
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      pathParameters: null,
      // Add other required APIGatewayProxyEvent properties
      isBase64Encoded: false,
      httpMethod: 'GET',
      path: '/',
      resource: '/',
      stageVariables: null,
      requestContext: {}
    } as unknown as MiddyEvent;
    mockContext = {} as Context;

    const mockCallbackFn = jest.fn();
    mockCallback = {
      ...mockCallbackFn,
      signal: new AbortController().signal
    } as MiddyHandlerObject;
  });

  describe('middyApiGateway', () => {
    it('should correctly wrap a handler with middleware', () => {
      const wrappedHandler = middyApiGateway(mockHandler);
      expect(wrappedHandler).toHaveProperty('use');
      expect(wrappedHandler).toHaveProperty('before');
      expect(wrappedHandler).toHaveProperty('after');
      expect(wrappedHandler).toHaveProperty('onError');
    });
  });

  describe('httpErrorHandler', () => {
    it('should handle ZodError correctly', async () => {
      const schema = z.object({ name: z.string() });
      mockHandler.mockImplementation(() => {
        throw new ZodError(
          schema.safeParse({ name: 123 }).error?.issues as ZodIssue[]
        );
      });

      const wrappedHandler = middyApiGateway(mockHandler);
      const response = (await wrappedHandler(
        mockEvent,
        mockContext,
        mockCallback
      )) as APIGatewayHandlerResponse;

      expect(response).toHaveProperty('statusCode', 400);
      expect(response).toHaveProperty('body');

      const body = response.body as {
        errors: Array<{ title: string; meta?: unknown }>;
      };
      expect(body).toHaveProperty('errors');
      expect(body.errors[0]).toHaveProperty('title');
      expect(body.errors[0]).toHaveProperty('meta');
    });

    it('should handle HttpError correctly', async () => {
      mockHandler.mockImplementation(() => {
        throw new HttpError({ statusCode: 403, message: 'Forbidden access' });
      });

      const wrappedHandler = middyApiGateway(mockHandler);
      const response = (await wrappedHandler(
        mockEvent,
        mockContext,
        mockCallback
      )) as APIGatewayHandlerResponse;

      expect(response).toHaveProperty('statusCode', 403);
      expect(response).toHaveProperty('body');

      const body = response.body as { errors: Array<{ title: string }> };
      expect(body).toHaveProperty('errors');
      expect(body.errors[0]).toHaveProperty('title', 'Forbidden access');
    });

    it('should handle generic errors correctly', async () => {
      mockHandler.mockImplementation(() => {
        throw new Error('Something went wrong');
      });

      const wrappedHandler = middyApiGateway(mockHandler);
      const response = (await wrappedHandler(
        mockEvent,
        mockContext,
        mockCallback
      )) as APIGatewayHandlerResponse;

      expect(response).toHaveProperty('statusCode', 500);
      expect(response).toHaveProperty('body');

      const body = response.body as { errors: Array<{ title: string }> };
      expect(body).toHaveProperty('errors');
      expect(body.errors[0]).toHaveProperty('title', 'Something went wrong');
    });
  });

  it('should successfully process a valid request', async () => {
    const successBody = { success: true, data: { message: 'Hello World' } };
    mockHandler.mockResolvedValue({
      statusCode: 200,
      body: successBody
    });

    const wrappedHandler = middyApiGateway(mockHandler);
    const response = (await wrappedHandler(
      mockEvent,
      mockContext,
      mockCallback
    )) as APIGatewayHandlerResponse;

    expect(response).toHaveProperty('statusCode', 200);
    expect(response).toHaveProperty('body');
    expect(response.body).toEqual(successBody);
  });
});
