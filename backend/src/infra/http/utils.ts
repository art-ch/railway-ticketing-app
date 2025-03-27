const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

export const respondError = (
  statusCode: number,
  errors: unknown,
  meta?: unknown
) => ({
  statusCode,
  headers: {
    ...corsHeaders
  },
  body: {
    errors,
    meta
  }
});

export const respondOk = (data: unknown) => ({
  statusCode: 200,
  headers: {
    ...corsHeaders
  },
  body: { data }
});
