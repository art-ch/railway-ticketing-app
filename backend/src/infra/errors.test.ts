import { HttpError } from './errors';

describe('HttpError', () => {
  it('should create an error with the provided status code and message', () => {
    const statusCode = 404;
    const message = 'Resource not found';
    const error = new HttpError({ statusCode, message });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.statusCode).toBe(statusCode);
    expect(error.message).toBe(message);
  });

  it('should be throwable and catchable', () => {
    const statusCode = 403;
    const message = 'Forbidden';

    expect(() => {
      throw new HttpError({ statusCode, message });
    }).toThrow(HttpError);

    try {
      throw new HttpError({ statusCode, message });
    } catch (error) {
      expect(error instanceof HttpError).toBe(true);
      if (error instanceof HttpError) {
        expect(error.statusCode).toBe(statusCode);
        expect(error.message).toBe(message);
      }
    }
  });

  it('should work with instanceof checks', () => {
    const error = new HttpError({ statusCode: 500, message: 'Server error' });
    expect(error instanceof Error).toBe(true);
    expect(error instanceof HttpError).toBe(true);
  });
});
