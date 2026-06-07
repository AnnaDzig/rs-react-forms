import type { ZodError } from 'zod';

import type { FormValues } from '../types/formTypes';

export type FieldErrors = Partial<Record<keyof FormValues, string>>;

export function getFieldErrors(error: ZodError<FormValues>): FieldErrors {
  const errors: FieldErrors = {};

  error.issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName !== 'string') {
      return;
    }

    errors[fieldName as keyof FormValues] = issue.message;
  });

  return errors;
}
