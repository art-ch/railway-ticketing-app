export const respondError = (
  statusCode: number,
  errors: unknown,
  meta?: unknown
) => ({
  statusCode,
  body: {
    errors,
    meta
  }
});

export const respondOk = (data: unknown) => ({
  statusCode: 200,
  body: { data }
});
