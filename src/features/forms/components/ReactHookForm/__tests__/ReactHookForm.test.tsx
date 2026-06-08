import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFormStore } from '../../../store/formStore';
import { ReactHookForm } from '../ReactHookForm';

class MockFileReader {
  result: string | ArrayBuffer | null = null;

  private readonly listeners: Partial<Record<string, () => void>> = {};

  addEventListener(event: string, callback: () => void) {
    this.listeners[event] = callback;
  }

  readAsDataURL() {
    this.result = 'data:image/png;base64,test-image';
    this.listeners.load?.();
  }
}

vi.stubGlobal('FileReader', MockFileReader);

function createTestImage() {
  return new File(['test image content'], 'avatar.png', {
    type: 'image/png',
  });
}

function renderReactHookForm() {
  const onSuccess = vi.fn();

  render(<ReactHookForm onSuccess={onSuccess} />);

  const submitButton = screen.getByRole('button', {
    name: /submit react hook form/i,
  });

  const form = submitButton.closest('form');

  if (!form) {
    throw new Error('React Hook Form was not found');
  }

  return {
    form,
    onSuccess,
    submitButton,
    user: userEvent.setup(),
  };
}

async function fillValidReactHookForm(
  user: ReturnType<typeof userEvent.setup>,
  form: HTMLFormElement,
  country = 'Denmark'
) {
  const formQueries = within(form);

  await user.type(
    formQueries.getByRole('textbox', { name: /^name$/i }),
    'Anna'
  );

  await user.type(
    formQueries.getByRole('spinbutton', { name: /^age$/i }),
    '35'
  );

  await user.type(
    formQueries.getByRole('textbox', { name: /^email$/i }),
    'anna@example.com'
  );

  await user.selectOptions(
    formQueries.getByRole('combobox', { name: /^gender$/i }),
    'female'
  );

  await user.type(
    formQueries.getByRole('combobox', { name: /^country$/i }),
    country
  );

  await user.upload(
    formQueries.getByLabelText(/^profile image$/i),
    createTestImage()
  );

  await user.type(formQueries.getByLabelText(/^password$/i), 'Anna123!');

  await user.type(
    formQueries.getByLabelText(/^confirm password$/i),
    'Anna123!'
  );

  await user.click(formQueries.getByLabelText(/terms and conditions/i));
}

describe('ReactHookForm', () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
    });
  });

  it('renders submit button as disabled initially', () => {
    const { submitButton } = renderReactHookForm();

    expect(submitButton).toBeDisabled();
  });

  it('shows live validation errors when fields are invalid', async () => {
    const { form, user } = renderReactHookForm();
    const formQueries = within(form);

    await user.type(
      formQueries.getByRole('textbox', { name: /^name$/i }),
      'anna'
    );
    await user.type(
      formQueries.getByRole('textbox', { name: /^email$/i }),
      'annaexample'
    );

    await user.click(formQueries.getByLabelText(/terms and conditions/i));
    await user.click(formQueries.getByLabelText(/terms and conditions/i));

    expect(
      await screen.findByText(/^name must start with an uppercase letter$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/^email must contain one @ and a domain with a dot$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/^you must accept terms and conditions$/i)
    ).toBeInTheDocument();
  });

  it('enables submit button and stores data after valid submit', async () => {
    const { form, onSuccess, submitButton, user } = renderReactHookForm();
    const formQueries = within(form);

    await fillValidReactHookForm(user, form);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(
      formQueries.getByRole('button', { name: /submit react hook form/i })
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    const submissions = useFormStore.getState().submissions;

    expect(submissions).toHaveLength(1);

    expect(submissions[0]).toMatchObject({
      source: 'react-hook-form',
      name: 'Anna',
      age: 35,
      email: 'anna@example.com',
      gender: 'female',
      acceptedTerms: true,
      country: 'Denmark',
      imageBase64: 'data:image/png;base64,test-image',
      isNew: true,
    });
  });

  it('shows country validation error when country is not from the stored list', async () => {
    const { form, user } = renderReactHookForm();

    await fillValidReactHookForm(user, form, 'Wonderland');

    expect(
      await screen.findByText(/^choose a country from the list$/i)
    ).toBeInTheDocument();

    expect(useFormStore.getState().submissions).toHaveLength(0);
  });
});
