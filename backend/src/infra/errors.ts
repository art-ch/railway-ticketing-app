interface HttpErrorParams {
  statusCode: number;
  message: string;
}

export class HttpError extends Error {
  readonly statusCode: number;

  constructor({ statusCode, message }: HttpErrorParams) {
    super(message);
    this.statusCode = statusCode;
  }
}
