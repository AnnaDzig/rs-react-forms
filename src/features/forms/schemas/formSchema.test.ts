import { describe, expect, it } from 'vitest';

import { validateImageFile } from './formSchema';

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
