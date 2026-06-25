import { z } from 'zod';
import { ValidationError } from '../errors/validation-error';

export function parseWithZod<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join('; ');
    throw new ValidationError(message);
  }

  return result.data;
}
