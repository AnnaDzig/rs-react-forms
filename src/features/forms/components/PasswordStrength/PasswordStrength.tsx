import { getPasswordStrength } from '../../utils/passwordStrength';
import './PasswordStrength.css';

type PasswordStrengthProps = {
  password: string;
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  const checks = [
    { label: '1 number', isValid: strength.hasNumber },
    { label: '1 uppercase', isValid: strength.hasUppercase },
    { label: '1 lowercase', isValid: strength.hasLowercase },
    { label: '1 special character', isValid: strength.hasSpecialCharacter },
  ];

  return (
    <ul className="password-strength" aria-label="Password strength">
      {checks.map((check) => (
        <li
          className={
            check.isValid
              ? 'password-strength__item password-strength__item--valid'
              : 'password-strength__item'
          }
          key={check.label}
        >
          {check.isValid ? '✓' : '○'} {check.label}
        </li>
      ))}
    </ul>
  );
}
