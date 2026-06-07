import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /form handling with react/i })
    ).toBeInTheDocument();
  });

  it('renders form action buttons', () => {
    render(<App />);

    expect(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /open react hook form/i })
    ).toBeInTheDocument();
  });
});
