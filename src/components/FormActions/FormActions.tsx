import './FormActions';

type FormActionsProps = {
  onOpenUncontrolledForm: () => void;
  onOpenReactHookForm: () => void;
};

export function FormActions({
  onOpenUncontrolledForm,
  onOpenReactHookForm,
}: FormActionsProps) {
  return (
    <section className="form-actions" aria-labelledby="form-actions-title">
      <div>
        <h2 id="form-actions-title" className="form-actions__title">
          Choose form type
        </h2>
        <p className="form-actions__description">
          Both forms collect the same data, but they handle validation and field
          values differently.
        </p>
      </div>

      <div className="form-actions__buttons">
        <button
          className="form-actions__button"
          type="button"
          onClick={onOpenUncontrolledForm}
        >
          Open uncontrolled form
        </button>

        <button
          className="form-actions__button form-actions__button--secondary"
          type="button"
          onClick={onOpenReactHookForm}
        >
          Open React Hook Form
        </button>
      </div>
    </section>
  );
}
