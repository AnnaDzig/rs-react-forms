import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /form handling with react/i })
    ).toBeInTheDocument();
  });

  it('opens uncontrolled form modal', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );

    expect(
      screen.getByRole('dialog', { name: /uncontrolled form/i })
    ).toBeInTheDocument();
  });

  it('closes modal by close button', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: /open react hook form/i })
    );

    await user.click(screen.getByRole('button', { name: /close modal/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal by Escape key', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
