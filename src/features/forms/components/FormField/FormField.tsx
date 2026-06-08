import type { ReactNode } from 'react';

import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import './FormField.css';

type FormFieldProps = {
  children: ReactNode;
  error?: string;
  errorId: string;
  hint?: string;
  htmlFor: string;
  label: string;
};

export function FormField({
  children,
  error,
  errorId,
  hint,
  htmlFor,
  label,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <div className="form-field__label-row">
        <label className="form-field__label" htmlFor={htmlFor}>
          {label}
        </label>

        {hint ? <span className="form-field__hint">{hint}</span> : null}
      </div>

      {children}

      <ErrorMessage id={errorId} message={error} />
    </div>
  );
}
