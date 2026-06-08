import { getPasswordStrength } from '../passwordStrength';

describe('getPasswordStrength', () => {
  it('detects number, uppercase, lowercase, and special character', () => {
    expect(getPasswordStrength('Anna123!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: true,
    });
  });

  it('returns false checks for an empty password', () => {
    expect(getPasswordStrength('')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecialCharacter: false,
    });
  });

  it('detects missing special character', () => {
    expect(getPasswordStrength('Anna123')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialCharacter: false,
    });
  });
});
