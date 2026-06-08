import type { ParsedFormValues } from '../schemas/formSchema';
import type { FormSource, FormSubmission, Gender } from '../types/formTypes';

type CreateSubmissionParams = {
  values: ParsedFormValues;
  source: FormSource;
};

function toGender(value: string): Gender {
  if (
    value === 'female' ||
    value === 'male' ||
    value === 'other' ||
    value === 'prefer-not-to-say'
  ) {
    return value;
  }

  throw new Error('Invalid gender value');
}

export function createSubmission({
  values,
  source,
}: CreateSubmissionParams): FormSubmission {
  return {
    id: crypto.randomUUID(),
    source,
    name: values.name.trim(),
    age: Number(values.age),
    email: values.email.trim(),
    gender: toGender(values.gender),
    acceptedTerms: values.acceptedTerms,
    imageBase64: values.imageBase64,
    password: values.password,
    country: values.country.trim(),
    createdAt: new Date().toISOString(),
    isNew: true,
  };
}
