import { useState } from 'react';

import { AppHeader } from './components/AppHeader/AppHeader';
import { FormActions } from './components/FormActions/FormActions';
import { SubmissionsList } from './components/SubmissionsList/SubmissionsList';
import type { FormSource } from './features/forms/types/formTypes';
import { Modal } from './components/Modal/Modal';
import { UncontrolledForm } from './features/forms/components/UncontrolledForm/UncontrolledForm';

import './App';
import { ReactHookForm } from './features/forms/components/ReactHookForm/ReactHookForm';

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
        <Modal
          title={
            activeForm === 'uncontrolled'
              ? 'Uncontrolled form'
              : 'React Hook Form'
          }
          onClose={closeModal}
        >
          {activeForm === 'uncontrolled' ? (
            <UncontrolledForm onSuccess={closeModal} />
          ) : (
            <ReactHookForm onSuccess={closeModal} />
          )}
        </Modal>
      ) : null}
    </main>
  );
}

export default App;
