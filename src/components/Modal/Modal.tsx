import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import './Modal.css';

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function Modal({ title, children, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    const dialog = dialogRef.current;
    const firstFocusableElement =
      dialog?.querySelector<HTMLElement>(focusableSelector);

    firstFocusableElement?.focus();

    return () => {
      previouslyFocusedElementRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        trapFocus(event);
      }
    }

    function trapFocus(event: KeyboardEvent) {
      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements =
        dialog.querySelectorAll<HTMLElement>(focusableSelector);

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className="modal"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>

          <button
            className="modal__close-button"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal__content">{children}</div>
      </div>
    </div>,
    document.body
  );
}
