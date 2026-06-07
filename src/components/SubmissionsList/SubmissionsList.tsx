import { useFormStore } from '../../features/forms/store/formStore';
import './SubmissionsList';

export function SubmissionsList() {
  const submissions = useFormStore((state) => state.submissions);

  return (
    <section className="submissions" aria-labelledby="submissions-title">
      <div className="submissions__header">
        <h2 id="submissions-title" className="submissions__title">
          Submitted profiles
        </h2>
        <span className="submissions__count">{submissions.length}</span>
      </div>

      {submissions.length === 0 ? (
        <p className="submissions__empty">
          No submissions yet. Open one of the forms and submit valid data.
        </p>
      ) : (
        <ul className="submissions__list">
          {submissions.map((submission) => (
            <li
              className={
                submission.isNew
                  ? 'submissions__card submissions__card--new'
                  : 'submissions__card'
              }
              key={submission.id}
            >
              <img
                className="submissions__image"
                src={submission.imageBase64}
                alt={`${submission.name}'s uploaded profile`}
              />

              <div className="submissions__content">
                <h3 className="submissions__name">{submission.name}</h3>
                <p className="submissions__meta">
                  {submission.age} years old · {submission.gender}
                </p>
                <p className="submissions__text">{submission.email}</p>
                <p className="submissions__text">{submission.country}</p>
                <p className="submissions__source">
                  Submitted with: {submission.source}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
