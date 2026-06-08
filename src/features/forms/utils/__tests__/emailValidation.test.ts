import { isBasicEmailValid } from '../emailValidation';

describe('isBasicEmailValid', () => {
  it('returns true for a basic valid email', () => {
    expect(isBasicEmailValid('anna@example.com')).toBe(true);
  });

  it('returns false when email has no @', () => {
    expect(isBasicEmailValid('anna.example.com')).toBe(false);
  });

  it('returns false when email has more than one @', () => {
    expect(isBasicEmailValid('anna@@example.com')).toBe(false);
  });

  it('returns false when local part is empty', () => {
    expect(isBasicEmailValid('@example.com')).toBe(false);
  });

  it('returns false when domain has no dot', () => {
    expect(isBasicEmailValid('anna@example')).toBe(false);
  });
});
