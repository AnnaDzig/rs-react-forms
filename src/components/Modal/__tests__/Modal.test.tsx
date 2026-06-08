import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders modal content in a dialog', () => {
    render(
      <Modal title="Test modal" onClose={vi.fn()}>
        <button type="button">First action</button>
      </Modal>
    );

    expect(
      screen.getByRole('dialog', { name: /test modal/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /first action/i })
    ).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Test modal" onClose={onClose}>
        <button type="button">First action</button>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: /close modal/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal title="Test modal" onClose={onClose}>
        <button type="button">First action</button>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('moves focus to the first focusable element', () => {
    render(
      <Modal title="Test modal" onClose={vi.fn()}>
        <button type="button">First action</button>
        <button type="button">Second action</button>
      </Modal>
    );

    expect(screen.getByRole('button', { name: /close modal/i })).toHaveFocus();
  });

  it('traps focus inside modal when tabbing forward', async () => {
    const user = userEvent.setup();

    render(
      <Modal title="Test modal" onClose={vi.fn()}>
        <button type="button">First action</button>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });

    expect(closeButton).toHaveFocus();

    await user.tab();

    expect(screen.getByRole('button', { name: /first action/i })).toHaveFocus();

    await user.tab();

    expect(closeButton).toHaveFocus();
  });
});
