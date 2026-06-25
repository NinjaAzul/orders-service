import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}
