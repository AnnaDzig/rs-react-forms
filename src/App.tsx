import { useState } from 'react';

import { AppHeader } from './components/AppHeader/AppHeader';
import { FormActions } from './components/FormActions/FormActions';
import { SubmissionsList } from './components/SubmissionsList/SubmissionsList';
import type { FormSource } from './features/forms/types/formTypes';
import './App';

function App() {
  const [activeForm, setActiveForm] = useState<FormSource | null>(null);

  function openUncontrolledForm() {
    setActiveForm('uncontrolled');
  }

  function openReactHookForm() {
    setActiveForm('react-hook-form');
  }

  function closeModal() {
    setActiveForm(null);
  }

  return (
    <main className="app">
      <AppHeader />

      <FormActions
        onOpenUncontrolledForm={openUncontrolledForm}
        onOpenReactHookForm={openReactHookForm}
      />

      <SubmissionsList />

      {activeForm ? (
        <p className="app__temporary-modal-note">
          Modal placeholder: {activeForm}
          <button type="button" onClick={closeModal}>
            Close
          </button>
        </p>
      ) : null}
    </main>
  );
}

export default App;
