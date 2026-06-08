import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  useForm,
  useWatch,
  type Resolver,
  type SubmitHandler,
} from 'react-hook-form';

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
import type { FormValues } from '../../types/formTypes';
import { createSubmission } from '../../utils/createSubmission';
import { fileToBase64 } from '../../utils/fileToBase64';
import '../formControls.css';
import './ReactHookForm.css';

type ReactHookFormProps = {
  onSuccess: () => void;
};

const defaultValues: FormValues = {
  name: '',
  age: '',
  email: '',
  gender: '',
  acceptedTerms: false,
  imageBase64: '',
  password: '',
  confirmPassword: '',
  country: '',
};

export function ReactHookForm({ onSuccess }: ReactHookFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState<string>();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
  } = useForm<FormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
  });

  const password = useWatch({
    control,
    name: 'password',
  });

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setImageError(undefined);
    setImagePreview('');
    setValue('imageBase64', '', {
      shouldDirty: true,
      shouldValidate: true,
    });

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

    setImagePreview(convertedImage);
    setValue('imageBase64', convertedImage, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  const submitForm: SubmitHandler<FormValues> = (values) => {
    const parsedValues = formSchema.safeParse(values);

    if (!parsedValues.success) {
      return;
    }

    if (!validateCountry(parsedValues.data.country, countries)) {
      setError('country', {
        message: 'Choose a country from the list',
        type: 'validate',
      });
      return;
    }

    addSubmission(
      createSubmission({
        values: parsedValues.data,
        source: 'react-hook-form',
      })
    );

    reset(defaultValues);
    setImagePreview('');
    setImageError(undefined);
    onSuccess();
  };

  return (
    <form className="form" noValidate onSubmit={handleSubmit(submitForm)}>
      <div className="form__grid">
        <FormField
          error={errors.name?.message}
          errorId="rhf-name-error"
          htmlFor="rhf-name"
          label="Name"
        >
          <input
            aria-describedby="rhf-name-error"
            aria-invalid={Boolean(errors.name)}
            className="form__input"
            id="rhf-name"
            placeholder="Anna"
            type="text"
            {...register('name')}
          />
        </FormField>

        <FormField
          error={errors.age?.message}
          errorId="rhf-age-error"
          htmlFor="rhf-age"
          label="Age"
        >
          <input
            aria-describedby="rhf-age-error"
            aria-invalid={Boolean(errors.age)}
            className="form__input"
            id="rhf-age"
            min="0"
            placeholder="35"
            type="number"
            {...register('age')}
          />
        </FormField>
      </div>

      <FormField
        error={errors.email?.message}
        errorId="rhf-email-error"
        htmlFor="rhf-email"
        label="Email"
      >
        <input
          aria-describedby="rhf-email-error"
          aria-invalid={Boolean(errors.email)}
          className="form__input"
          id="rhf-email"
          placeholder="anna@example.com"
          type="email"
          {...register('email')}
        />
      </FormField>

      <div className="form__grid">
        <FormField
          error={errors.gender?.message}
          errorId="rhf-gender-error"
          htmlFor="rhf-gender"
          label="Gender"
        >
          <select
            aria-describedby="rhf-gender-error"
            aria-invalid={Boolean(errors.gender)}
            className="form__select"
            id="rhf-gender"
            {...register('gender')}
          >
            <option value="">Choose gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </FormField>

        <FormField
          error={errors.country?.message}
          errorId="rhf-country-error"
          htmlFor="rhf-country"
          label="Country"
        >
          <input
            aria-describedby="rhf-country-error"
            aria-invalid={Boolean(errors.country)}
            className="form__input"
            id="rhf-country"
            list="rhf-countries"
            placeholder="Denmark"
            type="text"
            {...register('country')}
          />
          <CountryDatalist countries={countries} id="rhf-countries" />
        </FormField>
      </div>

      <FormField
        error={imageError ?? errors.imageBase64?.message}
        errorId="rhf-image-error"
        hint="PNG or JPEG, max 1MB"
        htmlFor="rhf-image"
        label="Profile image"
      >
        <input
          accept="image/png,image/jpeg"
          aria-describedby="rhf-image-error"
          aria-invalid={Boolean(imageError ?? errors.imageBase64)}
          className="form__input react-hook-form__file"
          id="rhf-image"
          type="file"
          onChange={handleImageChange}
        />
        <input type="hidden" {...register('imageBase64')} />
      </FormField>

      {imagePreview ? (
        <img
          className="react-hook-form__preview"
          src={imagePreview}
          alt="Selected profile preview"
        />
      ) : null}

      <div className="form__grid">
        <FormField
          error={errors.password?.message}
          errorId="rhf-password-error"
          htmlFor="rhf-password"
          label="Password"
        >
          <input
            aria-describedby="rhf-password-error"
            aria-invalid={Boolean(errors.password)}
            className="form__input"
            id="rhf-password"
            type="password"
            {...register('password')}
          />
          <PasswordStrength password={password ?? ''} />
        </FormField>

        <FormField
          error={errors.confirmPassword?.message}
          errorId="rhf-confirm-password-error"
          htmlFor="rhf-confirm-password"
          label="Confirm password"
        >
          <input
            aria-describedby="rhf-confirm-password-error"
            aria-invalid={Boolean(errors.confirmPassword)}
            className="form__input"
            id="rhf-confirm-password"
            type="password"
            {...register('confirmPassword')}
          />
        </FormField>
      </div>

      <div>
        <label className="form__checkbox-label" htmlFor="rhf-terms">
          <input
            aria-describedby="rhf-terms-error"
            className="form__checkbox"
            id="rhf-terms"
            type="checkbox"
            {...register('acceptedTerms')}
          />
          <span>I accept Terms and Conditions</span>
        </label>
        <ErrorMessage
          id="rhf-terms-error"
          message={errors.acceptedTerms?.message}
        />
      </div>

      <div className="form__actions">
        <button className="form__button" disabled={!isValid} type="submit">
          Submit React Hook Form
        </button>
      </div>
    </form>
  );
}
