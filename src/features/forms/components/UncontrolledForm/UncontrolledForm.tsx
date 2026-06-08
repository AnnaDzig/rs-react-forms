import { useState } from 'react';

import { CountryDatalist } from '../CountryDatalist/CountryDatalist';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FormField } from '../FormField/FormField';
import { PasswordStrength } from '../PasswordStrength/PasswordStrength';
import {
  formSchema,
  validateCountry,
  validateImageFile,
} from '../../schemas/formSchema';
import { useFormStore } from '../../store/formStore';
import type { FormValues, Gender } from '../../types/formTypes';
import { createSubmission } from '../../utils/createSubmission';
import { fileToBase64 } from '../../utils/fileToBase64';
import { getFieldErrors, type FieldErrors } from '../../utils/getFieldErrors';
import '../formControls.css';
import './UncontrolledForm.css';

type UncontrolledFormProps = {
  onSuccess: () => void;
};

const initialErrors: FieldErrors = {};

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);
  const [errors, setErrors] = useState<FieldErrors>(initialErrors);
  const [password, setPassword] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageError, setImageError] = useState<string>();

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setImageError(undefined);
    setImageBase64('');

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      setImageError(validationError);
      event.target.value = '';
      return;
    }

    const convertedImage = await fileToBase64(file);
    setImageBase64(convertedImage);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const values: FormValues = {
      name: String(formData.get('name') ?? ''),
      age: String(formData.get('age') ?? ''),
      email: String(formData.get('email') ?? ''),
      gender: getGenderValue(formData.get('gender')),
      acceptedTerms: formData.get('acceptedTerms') === 'on',
      imageBase64,
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      country: String(formData.get('country') ?? ''),
    };

    const parsedValues = formSchema.safeParse(values);

    if (!parsedValues.success) {
      setErrors(getFieldErrors(parsedValues.error));
      return;
    }

    if (!validateCountry(parsedValues.data.country, countries)) {
      setErrors({ country: 'Choose a country from the list' });
      return;
    }

    addSubmission(
      createSubmission({
        values: parsedValues.data,
        source: 'uncontrolled',
      })
    );

    form.reset();
    setErrors(initialErrors);
    setPassword('');
    setImageBase64('');
    setImageError(undefined);
    onSuccess();
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <div className="form__grid">
        <FormField
          error={errors.name}
          errorId="uncontrolled-name-error"
          htmlFor="uncontrolled-name"
          label="Name"
        >
          <input
            aria-describedby="uncontrolled-name-error"
            aria-invalid={Boolean(errors.name)}
            className="form__input"
            id="uncontrolled-name"
            name="name"
            placeholder="Anna"
            type="text"
          />
        </FormField>

        <FormField
          error={errors.age}
          errorId="uncontrolled-age-error"
          htmlFor="uncontrolled-age"
          label="Age"
        >
          <input
            aria-describedby="uncontrolled-age-error"
            aria-invalid={Boolean(errors.age)}
            className="form__input"
            id="uncontrolled-age"
            min="0"
            name="age"
            placeholder="35"
            type="number"
          />
        </FormField>
      </div>

      <FormField
        error={errors.email}
        errorId="uncontrolled-email-error"
        htmlFor="uncontrolled-email"
        label="Email"
      >
        <input
          aria-describedby="uncontrolled-email-error"
          aria-invalid={Boolean(errors.email)}
          className="form__input"
          id="uncontrolled-email"
          name="email"
          placeholder="anna@example.com"
          type="email"
        />
      </FormField>

      <div className="form__grid">
        <FormField
          error={errors.gender}
          errorId="uncontrolled-gender-error"
          htmlFor="uncontrolled-gender"
          label="Gender"
        >
          <select
            aria-describedby="uncontrolled-gender-error"
            aria-invalid={Boolean(errors.gender)}
            className="form__select"
            id="uncontrolled-gender"
            name="gender"
          >
            <option value="">Choose gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </FormField>

        <FormField
          error={errors.country}
          errorId="uncontrolled-country-error"
          htmlFor="uncontrolled-country"
          label="Country"
        >
          <input
            aria-describedby="uncontrolled-country-error"
            aria-invalid={Boolean(errors.country)}
            className="form__input"
            id="uncontrolled-country"
            list="uncontrolled-countries"
            name="country"
            placeholder="Denmark"
            type="text"
          />
          <CountryDatalist countries={countries} id="uncontrolled-countries" />
        </FormField>
      </div>

      <FormField
        error={imageError ?? errors.imageBase64}
        errorId="uncontrolled-image-error"
        hint="PNG or JPEG, max 1MB"
        htmlFor="uncontrolled-image"
        label="Profile image"
      >
        <input
          accept="image/png,image/jpeg"
          aria-describedby="uncontrolled-image-error"
          aria-invalid={Boolean(imageError ?? errors.imageBase64)}
          className="form__input uncontrolled-form__file"
          id="uncontrolled-image"
          name="image"
          type="file"
          onChange={handleImageChange}
        />
      </FormField>

      {imageBase64 ? (
        <img
          className="uncontrolled-form__preview"
          src={imageBase64}
          alt="Selected profile preview"
        />
      ) : null}

      <div className="">
        <FormField
          error={errors.password}
          errorId="uncontrolled-password-error"
          htmlFor="uncontrolled-password"
          label="Password"
        >
          <input
            aria-describedby="uncontrolled-password-error"
            aria-invalid={Boolean(errors.password)}
            className="form__input"
            id="uncontrolled-password"
            name="password"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordStrength password={password} />
        </FormField>

        <FormField
          error={errors.confirmPassword}
          errorId="uncontrolled-confirm-password-error"
          htmlFor="uncontrolled-confirm-password"
          label="Confirm password"
        >
          <input
            aria-describedby="uncontrolled-confirm-password-error"
            aria-invalid={Boolean(errors.confirmPassword)}
            className="form__input"
            id="uncontrolled-confirm-password"
            name="confirmPassword"
            type="password"
          />
        </FormField>
      </div>

      <div>
        <label className="form__checkbox-label" htmlFor="uncontrolled-terms">
          <input
            aria-describedby="uncontrolled-terms-error"
            className="form__checkbox"
            id="uncontrolled-terms"
            name="acceptedTerms"
            type="checkbox"
          />
          <span>I accept Terms and Conditions</span>
        </label>

        <ErrorMessage
          id="uncontrolled-terms-error"
          message={errors.acceptedTerms}
        />
      </div>

      <div className="form__actions">
        <button className="form__button" type="submit">
          Submit uncontrolled form
        </button>
      </div>
    </form>
  );
}

function getGenderValue(value: FormDataEntryValue | null): Gender | '' {
  const stringValue = String(value ?? '');

  if (
    stringValue === 'female' ||
    stringValue === 'male' ||
    stringValue === 'other' ||
    stringValue === 'prefer-not-to-say'
  ) {
    return stringValue;
  }

  return '';
}
