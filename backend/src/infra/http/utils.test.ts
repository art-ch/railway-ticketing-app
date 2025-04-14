import { respondError, respondOk } from './utils';

describe('http utils', () => {
  const expectedCorsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  describe('respondError', () => {
    it('should return an object with the correct structure', () => {
      const result = respondError(400, 'Bad Request');

      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('headers');
      expect(result).toHaveProperty('body');
      expect(result.body).toHaveProperty('errors');
    });

    it('should set the provided status code', () => {
      const statusCode = 404;
      const result = respondError(statusCode, 'Not Found');

      expect(result.statusCode).toBe(statusCode);
    });

    it('should include the provided error message', () => {
      const errorMessage = 'Resource not found';
      const result = respondError(404, errorMessage);

      expect(result.body.errors).toBe(errorMessage);
    });

    it('should include CORS headers', () => {
      const result = respondError(500, 'Server Error');

      expect(result.headers).toEqual(expectedCorsHeaders);
    });

    it('should include meta data when provided', () => {
      const meta = { requestId: '123abc' };
      const result = respondError(400, 'Bad Request', meta);

      expect(result.body.meta).toEqual(meta);
    });

    it('should handle complex error objects', () => {
      const errors = [
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too short' }
      ];
      const result = respondError(400, errors);

      expect(result.body.errors).toEqual(errors);
    });
  });

  describe('respondOk', () => {
    it('should return an object with the correct structure', () => {
      const result = respondOk({ message: 'Success' });

      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('headers');
      expect(result).toHaveProperty('body');
      expect(result.body).toHaveProperty('data');
    });

    it('should set status code to 200', () => {
      const result = respondOk({ message: 'Success' });

      expect(result.statusCode).toBe(200);
    });

    it('should include the provided data', () => {
      const data = { user: { id: 1, name: 'John' } };
      const result = respondOk(data);

      expect(result.body.data).toEqual(data);
    });

    it('should include CORS headers', () => {
      const result = respondOk({ message: 'Success' });

      expect(result.headers).toEqual(expectedCorsHeaders);
    });

    it('should handle primitive data types', () => {
      const testCases = ['string value', 123, true, null];

      testCases.forEach((testCase) => {
        const result = respondOk(testCase);
        expect(result.body.data).toBe(testCase);
      });
    });

    it('should handle complex data structures', () => {
      const complexData = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ],
        pagination: {
          page: 1,
          total: 10
        }
      };

      const result = respondOk(complexData);
      expect(result.body.data).toEqual(complexData);
    });
  });
});
