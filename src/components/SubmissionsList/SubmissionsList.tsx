import { useEffect } from 'react';

import { useFormStore } from '../../features/forms/store/formStore';
import './SubmissionsList.css';

const NEW_SUBMISSION_HIGHLIGHT_TIME = 3000;

export function SubmissionsList() {
  const submissions = useFormStore((state) => state.submissions);
  const markSubmissionAsOld = useFormStore(
    (state) => state.markSubmissionAsOld
  );

  useEffect(() => {
    const newSubmissions = submissions.filter((submission) => submission.isNew);

    if (newSubmissions.length === 0) {
      return;
    }

    const timeoutIds = newSubmissions.map((submission) =>
      window.setTimeout(() => {
        markSubmissionAsOld(submission.id);
      }, NEW_SUBMISSION_HIGHLIGHT_TIME)
    );

    return () => {
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, [markSubmissionAsOld, submissions]);

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
