import { AppError } from './app-error';

export class ConflictError extends AppError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}
