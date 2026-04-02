import { useState } from 'react';
import { UiNotification } from '../types';

interface UseResetDialogOptions {
  factoryReset: () => Promise<void>;
  onSuccess: (notification: UiNotification) => void;
}

interface UseResetDialogReturn {
  isResetDialogOpen: boolean;
  openResetDialog: () => void;
  closeResetDialog: () => void;
  handleResetConfirm: () => Promise<void>;
}

export function useResetDialog({ factoryReset, onSuccess }: UseResetDialogOptions): UseResetDialogReturn {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetConfirm = async () => {
    await factoryReset();
    setIsResetDialogOpen(false);
    onSuccess({ type: 'success', message: 'Progreso local reiniciado.' });
  };

  return {
    isResetDialogOpen,
    openResetDialog: () => setIsResetDialogOpen(true),
    closeResetDialog: () => setIsResetDialogOpen(false),
    handleResetConfirm,
  };
}
