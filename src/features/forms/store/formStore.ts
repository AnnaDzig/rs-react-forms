import { create } from 'zustand';

import { countries } from './countries';
import type { FormSubmission } from '../types/formTypes';

type FormStore = {
  countries: string[];
  submissions: FormSubmission[];
  addSubmission: (submission: FormSubmission) => void;
  markSubmissionAsOld: (id: string) => void;
};

export const useFormStore = create<FormStore>((set) => ({
  countries: [...countries],
  submissions: [],

  addSubmission: (submission) => {
    set((state) => ({
      submissions: [submission, ...state.submissions],
    }));
  },

  markSubmissionAsOld: (id) => {
    set((state) => ({
      submissions: state.submissions.map((submission) =>
        submission.id === id ? { ...submission, isNew: false } : submission
      ),
    }));
  },
}));
