import { z } from 'zod';

import type { Gender } from '../types/formTypes';
import { isBasicEmailValid } from '../utils/emailValidation';

const MAX_IMAGE_SIZE_IN_BYTES = 1024 * 1024;

const genders = ['female', 'male', 'other', 'prefer-not-to-say'] as const;

export const allowedImageTypes = ['image/png', 'image/jpeg'] as const;

function isGender(value: string): value is Gender {
  return genders.some((gender) => gender === value);
}

export const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .refine((name) => name[0] === name[0]?.toUpperCase(), {
        message: 'Name must start with an uppercase letter',
      }),

    age: z
      .string()
      .trim()
      .min(1, 'Age is required')
      .refine((age) => !Number.isNaN(Number(age)), {
        message: 'Age must be a number',
      })
      .refine((age) => Number(age) >= 0, {
        message: 'Age cannot be negative',
      }),

    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .refine(isBasicEmailValid, {
        message: 'Email must contain one @ and a domain with a dot',
      }),

    gender: z.string().refine(isGender, {
      message: 'Gender is required',
    }),

    acceptedTerms: z.boolean().refine((value) => value, {
      message: 'You must accept Terms and Conditions',
    }),

    imageBase64: z.string().min(1, 'Image is required'),

    password: z.string().min(1, 'Password is required'),

    confirmPassword: z.string().min(1, 'Confirm password is required'),

    country: z.string().trim().min(1, 'Country is required'),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords must match',
      });
    }
  });

export function validateCountry(country: string, countries: string[]): boolean {
  return countries.includes(country);
}

export function validateImageFile(file: File): string | null {
  if (
    !allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number])
  ) {
    return 'Image must be PNG or JPEG';
  }

  if (file.size > MAX_IMAGE_SIZE_IN_BYTES) {
    return 'Image must be smaller than 1MB';
  }

  return null;
}

export type ParsedFormValues = z.infer<typeof formSchema>;
