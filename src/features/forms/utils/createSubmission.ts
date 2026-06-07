import type { ParsedFormValues } from '../schemas/formSchema';
import type { FormSource, FormSubmission } from '../types/formTypes';

type CreateSubmissionParams = {
  values: ParsedFormValues;
  source: FormSource;
};

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
    gender: values.gender,
    acceptedTerms: values.acceptedTerms,
    imageBase64: values.imageBase64,
    password: values.password,
    country: values.country.trim(),
    createdAt: new Date().toISOString(),
    isNew: true,
  };
}
