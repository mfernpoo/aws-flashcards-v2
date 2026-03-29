import React from 'react';
import { UiNotification } from '../types';

interface ToastProps {
  notification: UiNotification;
  onClose: () => void;
}

const toastStyles: Record<UiNotification['type'], string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const liveRole = notification.type === 'error' ? 'alert' : 'status';
  const livePoliteness = notification.type === 'error' ? 'assertive' : 'polite';
  const helperText =
    notification.type === 'error'
      ? 'La notificación permanecerá visible hasta que la cierres o sea reemplazada.'
      : 'La notificación desaparecerá automáticamente en unos segundos.';

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)] sm:w-full">
      <div
        className={`rounded-xl border shadow-lg px-4 py-3 ${toastStyles[notification.type]}`}
        role={liveRole}
        aria-live={livePoliteness}
        aria-atomic="true"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium">{notification.message}</p>
            <p className="text-xs mt-1 opacity-80">{helperText}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-wide opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded"
            aria-label="Cerrar notificación"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
