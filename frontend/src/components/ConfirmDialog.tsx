import React, { useEffect, useId, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/45 flex items-center justify-center p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
      >
        <div>
          <h2 id={titleId} className="text-xl font-bold text-aws-dark">{title}</h2>
          <p id={descriptionId} className="text-sm text-gray-500 mt-2">{message}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-sm hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
