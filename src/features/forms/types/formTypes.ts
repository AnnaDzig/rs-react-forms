export type Gender = 'female' | 'male' | 'other' | 'prefer-not-to-say';

export type FormSource = 'uncontrolled' | 'react-hook-form';

export type PasswordStrength = {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialCharacter: boolean;
};

export type FormSubmission = {
  id: string;
  source: FormSource;
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
  imageBase64: string;
  password: string;
  country: string;
  createdAt: string;
  isNew: boolean;
};

export type FormValues = {
  name: string;
  age: string;
  email: string;
  gender: Gender | '';
  acceptedTerms: boolean;
  imageBase64: string;
  password: string;
  confirmPassword: string;
  country: string;
};
