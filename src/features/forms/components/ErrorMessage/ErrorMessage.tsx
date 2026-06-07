import './ErrorMessage.css';

type ErrorMessageProps = {
  id: string;
  message?: string;
};

export function ErrorMessage({ id, message }: ErrorMessageProps) {
  return (
    <p className="error-message" id={id} role={message ? 'alert' : undefined}>
      {message ?? '\u00A0'}
    </p>
  );
}
