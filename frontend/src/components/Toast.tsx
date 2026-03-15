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
  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm">
      <div className={`rounded-xl border shadow-lg px-4 py-3 ${toastStyles[notification.type]}`}>
        <div className="flex items-start gap-3">
          <p className="text-sm font-medium flex-1">{notification.message}</p>
          <button onClick={onClose} className="text-xs uppercase tracking-wide opacity-70 hover:opacity-100">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
