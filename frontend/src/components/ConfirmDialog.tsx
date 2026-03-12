import React from 'react';

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
  return (
    <div className="fixed inset-0 z-40 bg-slate-950/45 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-aws-dark">{title}</h2>
          <p className="text-sm text-gray-500 mt-2">{message}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => void onConfirm()}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
