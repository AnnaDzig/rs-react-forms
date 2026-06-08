import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFormStore } from '../../../features/forms/store/formStore';
import type { FormSubmission } from '../../../features/forms/types/formTypes';
import { SubmissionsList } from '../SubmissionsList';

function createMockSubmission(id: string, isNew = true): FormSubmission {
  return {
    id,
    source: 'uncontrolled',
    name: 'Anna',
    age: 35,
    email: 'anna@example.com',
    gender: 'female',
    acceptedTerms: true,
    imageBase64: 'data:image/png;base64,test-image',
    password: 'Anna123!',
    country: 'Denmark',
    createdAt: '2026-06-08T00:00:00.000Z',
    isNew,
  };
}

describe('SubmissionsList', () => {
  beforeEach(() => {
    vi.useRealTimers();

    useFormStore.setState({
      submissions: [],
    });
  });

  it('renders empty state when there are no submissions', () => {
    render(<SubmissionsList />);

    expect(
      screen.getByRole('heading', { name: /^submitted profiles$/i })
    ).toBeInTheDocument();

    expect(screen.getByText('0')).toBeInTheDocument();

    expect(
      screen.getByText(
        /^no submissions yet\. open one of the forms and submit valid data\.$/i
      )
    ).toBeInTheDocument();
  });

  it('renders submitted profile card', () => {
    useFormStore.setState({
      submissions: [createMockSubmission('1', false)],
    });

    render(<SubmissionsList />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /^anna$/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/^35 years old · female$/i)).toBeInTheDocument();
    expect(screen.getByText('anna@example.com')).toBeInTheDocument();
    expect(screen.getByText('Denmark')).toBeInTheDocument();

    expect(
      screen.getByText(/^submitted with: uncontrolled$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByAltText(/^anna's uploaded profile$/i)
    ).toBeInTheDocument();
  });

  it('renders new submission with highlight class', () => {
    useFormStore.setState({
      submissions: [createMockSubmission('1', true)],
    });

    render(<SubmissionsList />);

    const card = screen.getByRole('listitem');

    expect(card).toHaveClass('submissions__card');
    expect(card).toHaveClass('submissions__card--new');
  });

  it('renders old submission without highlight class', () => {
    useFormStore.setState({
      submissions: [createMockSubmission('1', false)],
    });

    render(<SubmissionsList />);

    const card = screen.getByRole('listitem');

    expect(card).toHaveClass('submissions__card');
    expect(card).not.toHaveClass('submissions__card--new');
  });

  it('marks new submission as old after highlight timeout', () => {
    vi.useFakeTimers();

    useFormStore.setState({
      submissions: [createMockSubmission('1', true)],
    });

    render(<SubmissionsList />);

    expect(useFormStore.getState().submissions[0].isNew).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(useFormStore.getState().submissions[0].isNew).toBe(false);

    vi.useRealTimers();
  });
});
