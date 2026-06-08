import { describe, expect, it } from 'vitest';

import { createFormSchema, validateImageFile } from './formSchema';

const validValues = {
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

describe('createFormSchema', () => {
  it('accepts valid form values', () => {
    const result = createFormSchema(['Denmark', 'Ukraine']).safeParse(
      validValues
    );

    expect(result.success).toBe(true);
  });

  it('rejects lowercase name', () => {
    const result = createFormSchema().safeParse({
      ...validValues,
      name: 'anna',
    });

    expect(result.success).toBe(false);
  });

  it('rejects negative age', () => {
    const result = createFormSchema().safeParse({
      ...validValues,
      age: '-1',
    });

    expect(result.success).toBe(false);
  });

  it('rejects non-number age', () => {
    const result = createFormSchema().safeParse({
      ...validValues,
      age: 'abc',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid gender', () => {
    const result = createFormSchema().safeParse({
      ...validValues,
      gender: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects country outside provided countries list', () => {
    const result = createFormSchema(['Denmark']).safeParse({
      ...validValues,
      country: 'Wonderland',
    });

    expect(result.success).toBe(false);
  });

  it('rejects different passwords', () => {
    const result = createFormSchema().safeParse({
      ...validValues,
      confirmPassword: 'Different123!',
    });

    expect(result.success).toBe(false);
  });
});

describe('validateImageFile', () => {
  it('returns null for PNG images', () => {
    const file = new File(['test'], 'avatar.png', {
      type: 'image/png',
    });

    expect(validateImageFile(file)).toBeNull();
  });

  it('returns null for JPEG images', () => {
    const file = new File(['test'], 'avatar.jpeg', {
      type: 'image/jpeg',
    });

    expect(validateImageFile(file)).toBeNull();
  });

  it('returns an error for unsupported image types', () => {
    const file = new File(['test'], 'avatar.gif', {
      type: 'image/gif',
    });

    expect(validateImageFile(file)).toBe('Image must be PNG or JPEG');
  });

  it('returns an error when image is larger than 1MB', () => {
    const file = new File([new Uint8Array(1024 * 1024 + 1)], 'avatar.png', {
      type: 'image/png',
    });

    expect(validateImageFile(file)).toBe('Image must be smaller than 1MB');
  });
});
