import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import type { FormValues } from '../../types/formTypes';
import { formSchema } from '../../schemas/formSchema';
import { getFieldErrors } from '../getFieldErrors';

describe('getFieldErrors', () => {
  it('maps Zod issues to field errors', () => {
    const result = formSchema.safeParse({
      name: '',
      age: '',
      email: '',
      gender: '',
      acceptedTerms: false,
      imageBase64: '',
      password: '',
      confirmPassword: '',
      country: '',
    });

    if (result.success) {
      throw new Error('Expected schema validation to fail');
    }

    expect(getFieldErrors(result.error)).toMatchObject({
      name: 'Name is required',
      age: 'Age is required',
      gender: 'Gender is required',
      acceptedTerms: 'You must accept Terms and Conditions',
      imageBase64: 'Image is required',
      password: 'Password is required',
      confirmPassword: 'Confirm password is required',
      country: 'Country is required',
    });
  });

  it('ignores Zod issues without a string field name', () => {
    const result = z
      .array(z.string().min(2, 'Value is too short'))
      .safeParse(['']);

    if (result.success) {
      throw new Error('Expected schema validation to fail');
    }

    const error = result.error as unknown as z.ZodError<FormValues>;

    expect(getFieldErrors(error)).toEqual({});
  });
});
