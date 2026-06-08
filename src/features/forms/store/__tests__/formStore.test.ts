import { useFormStore } from '../formStore';
import type { FormSubmission } from '../../types/formTypes';

function createMockSubmission(id: string): FormSubmission {
  return {
    id,
    source: 'uncontrolled',
    name: 'Anna',
    age: 35,
    email: 'anna@example.com',
    gender: 'female',
    acceptedTerms: true,
    imageBase64: 'data:image/png;base64,test',
    password: 'Anna123!',
    country: 'Denmark',
    createdAt: '2026-06-08T00:00:00.000Z',
    isNew: true,
  };
}

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.setState({
      submissions: [],
    });
  });

  it('stores countries in the state', () => {
    expect(useFormStore.getState().countries).toContain('Denmark');
    expect(useFormStore.getState().countries).toContain('Ukraine');
  });

  it('adds new submissions to the beginning of the list', () => {
    const firstSubmission = createMockSubmission('1');
    const secondSubmission = createMockSubmission('2');

    useFormStore.getState().addSubmission(firstSubmission);
    useFormStore.getState().addSubmission(secondSubmission);

    expect(useFormStore.getState().submissions).toEqual([
      secondSubmission,
      firstSubmission,
    ]);
  });

  it('marks submission as old', () => {
    const submission = createMockSubmission('1');

    useFormStore.getState().addSubmission(submission);
    useFormStore.getState().markSubmissionAsOld('1');

    expect(useFormStore.getState().submissions[0].isNew).toBe(false);
  });
});
