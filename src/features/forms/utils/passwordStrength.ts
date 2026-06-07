import type { PasswordStrength } from '../types/formTypes';

const specialCharacters = [
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '?',
  '_',
  '-',
];

function isNumberCharacter(character: string): boolean {
  return character.trim() !== '' && Number.isInteger(Number(character));
}

function isUppercaseCharacter(character: string): boolean {
  return character !== character.toLowerCase();
}

function isLowercaseCharacter(character: string): boolean {
  return character !== character.toUpperCase();
}

function isSpecialCharacter(character: string): boolean {
  return specialCharacters.includes(character);
}

export function getPasswordStrength(password: string): PasswordStrength {
  const characters = [...password];

  return {
    hasNumber: characters.some(isNumberCharacter),
    hasUppercase: characters.some(isUppercaseCharacter),
    hasLowercase: characters.some(isLowercaseCharacter),
    hasSpecialCharacter: characters.some(isSpecialCharacter),
  };
}
