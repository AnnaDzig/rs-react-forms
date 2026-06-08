import { describe, expect, it } from 'vitest';

import type { ParsedFormValues } from '../../schemas/formSchema';
import type { FormValues } from '../../types/formTypes';
import { createSubmission } from '../createSubmission';

const validValues: FormValues = {
  name: 'Anna',
  age: '35',
  email: 'anna@example.com',
  gender: 'female',
  acceptedTerms: true,
  imageBase64: 'data:image/png;base64,test-image',
  password: 'Anna123!',
  confirmPassword: 'Anna123!',
  country: 'Denmark',
};

describe('createSubmission', () => {
  it('creates a form submission from valid form values', () => {
    const submission = createSubmission({
      values: validValues,
      source: 'react-hook-form',
    });

    expect(submission).toMatchObject({
      source: 'react-hook-form',
      name: 'Anna',
      age: 35,
      email: 'anna@example.com',
      gender: 'female',
      acceptedTerms: true,
      imageBase64: 'data:image/png;base64,test-image',
      password: 'Anna123!',
      country: 'Denmark',
      isNew: true,
    });

    expect(submission.id).toEqual(expect.any(String));
    expect(submission.createdAt).toEqual(expect.any(String));
  });

  it('trims text values before saving', () => {
    const submission = createSubmission({
      values: {
        ...validValues,
        name: ' Anna ',
        email: ' anna@example.com ',
        country: ' Denmark ',
      },
      source: 'uncontrolled',
    });

    expect(submission.name).toBe('Anna');
    expect(submission.email).toBe('anna@example.com');
    expect(submission.country).toBe('Denmark');
  });

  it('converts age from string to number', () => {
    const submission = createSubmission({
      values: {
        ...validValues,
        age: '42',
      },
      source: 'uncontrolled',
    });

    expect(submission.age).toBe(42);
  });

  it('throws when gender value is invalid at runtime', () => {
    const invalidValues = {
      ...validValues,
      gender: 'invalid-gender',
    } as unknown as ParsedFormValues;

    expect(() =>
      createSubmission({
        values: invalidValues,
        source: 'uncontrolled',
      })
    ).toThrow('Invalid gender value');
  });
});
