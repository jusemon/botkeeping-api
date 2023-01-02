import { ValidationError } from 'joi';

export const isValidationError = (error: unknown): error is ValidationError =>
  error instanceof ValidationError;
