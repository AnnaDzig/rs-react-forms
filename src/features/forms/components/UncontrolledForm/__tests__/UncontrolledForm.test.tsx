import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFormStore } from '../../../store/formStore';
import { UncontrolledForm } from '../UncontrolledForm';

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

function renderUncontrolledForm() {
  const onSuccess = vi.fn();

  render(<UncontrolledForm onSuccess={onSuccess} />);

  const submitButton = screen.getByRole('button', {
    name: /submit uncontrolled form/i,
  });

  const form = submitButton.closest('form');

  if (!form) {
    throw new Error('Uncontrolled form was not found');
  }

  return {
    form,
    onSuccess,
    user: userEvent.setup(),
  };
}

async function fillValidUncontrolledForm(
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

describe('UncontrolledForm', () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
    });
  });

  it('shows validation errors after submitting empty form', async () => {
    const { form, user } = renderUncontrolledForm();
    const formQueries = within(form);

    await user.click(
      formQueries.getByRole('button', { name: /submit uncontrolled form/i })
    );

    expect(screen.getByText(/^name is required$/i)).toBeInTheDocument();
    expect(screen.getByText(/^age is required$/i)).toBeInTheDocument();

    expect(
      screen.getByText(/^email must contain one @ and a domain with a dot$/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/^gender is required$/i)).toBeInTheDocument();
    expect(screen.getByText(/^country is required$/i)).toBeInTheDocument();
    expect(screen.getByText(/^image is required$/i)).toBeInTheDocument();
    expect(screen.getByText(/^password is required$/i)).toBeInTheDocument();

    expect(
      screen.getByText(/^confirm password is required$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/^you must accept terms and conditions$/i)
    ).toBeInTheDocument();
  });

  it('stores submitted data after valid submit', async () => {
    const { form, onSuccess, user } = renderUncontrolledForm();
    const formQueries = within(form);

    await fillValidUncontrolledForm(user, form);

    await user.click(
      formQueries.getByRole('button', { name: /submit uncontrolled form/i })
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    const submissions = useFormStore.getState().submissions;

    expect(submissions).toHaveLength(1);

    expect(submissions[0]).toMatchObject({
      source: 'uncontrolled',
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

  it('shows country validation error when country is not from the list', async () => {
    const { form, user } = renderUncontrolledForm();
    const formQueries = within(form);

    await fillValidUncontrolledForm(user, form, 'Wonderland');

    await user.click(
      formQueries.getByRole('button', { name: /submit uncontrolled form/i })
    );

    expect(
      screen.getByText(/choose a country from the list/i)
    ).toBeInTheDocument();

    expect(useFormStore.getState().submissions).toHaveLength(0);
  });

  it('shows image validation error when image is too large', async () => {
    const { form, user } = renderUncontrolledForm();
    const formQueries = within(form);

    const largeFile = new File(
      [new Uint8Array(1024 * 1024 + 1)],
      'avatar.png',
      {
        type: 'image/png',
      }
    );

    await user.upload(
      formQueries.getByLabelText(/^profile image$/i),
      largeFile
    );

    expect(
      screen.getByText(/^image must be smaller than 1mb$/i)
    ).toBeInTheDocument();
  });
});
