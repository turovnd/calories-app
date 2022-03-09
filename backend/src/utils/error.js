import { Error as MongooseError } from 'mongoose';

export class ValidationError extends Error {
  constructor(message, cause) {
    super(message || 'Bad request');
    this.cause = cause;
  }
}

export class AccessError extends Error {
  constructor(message) {
    super(message || 'Access deny');
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message || 'Not found');
  }
}

export const processError = (error, res) => {
  console.error(error);

  if (error instanceof MongooseError.ValidationError) {
    return res.status(400).send(error.message);
  }
  if (error instanceof ValidationError) {
    return res.status(400).send(error.message);
  }
  if (error instanceof AccessError) {
    return res.status(403).send(error.message);
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send(error.message);
  }
  res.status(500).send(error.toString());
};
