import './SubmissionCard';

import type { FormSubmission } from '../../features/forms/types/formTypes';

type SubmissionCardProps = {
  submission: FormSubmission;
};

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <article
      className={`submission-card ${submission.isNew ? 'submission-card--new' : ''}`}
    >
      <div className="submission-card__header">
        <img
          className="submission-card__image"
          src={submission.imageBase64}
          alt={`${submission.name}'s uploaded profile`}
        />

        <div>
          <h3 className="submission-card__title">{submission.name}</h3>
          <p className="submission-card__source">{submission.source}</p>
        </div>
      </div>

      <dl className="submission-card__details">
        <div>
          <dt>Age</dt>
          <dd>{submission.age}</dd>
        </div>

        <div>
          <dt>Email</dt>
          <dd>{submission.email}</dd>
        </div>

        <div>
          <dt>Gender</dt>
          <dd>{submission.gender}</dd>
        </div>

        <div>
          <dt>Country</dt>
          <dd>{submission.country}</dd>
        </div>
      </dl>
    </article>
  );
}
