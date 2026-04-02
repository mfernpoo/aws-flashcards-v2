import { useState, useEffect } from 'react';
import { UiNotification } from '../types';

const DISMISS_DELAY_MS = 3500;

interface UseNotificationReturn {
  notification: UiNotification | null;
  setNotification: (notification: UiNotification | null) => void;
}

export function useNotification(): UseNotificationReturn {
  const [notification, setNotification] = useState<UiNotification | null>(null);

  useEffect(() => {
    if (!notification) return;

    const timeoutId = window.setTimeout(() => {
      setNotification(null);
    }, DISMISS_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  return { notification, setNotification };
}
