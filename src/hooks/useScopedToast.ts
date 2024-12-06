import { useCallback } from 'react';
import { toast } from '@avalabs/core-k2-components';

export const useScopedToast = (id: string) => {
  const success = useCallback(
    (...[message, opts]: Parameters<typeof toast.success>) => {
      toast.dismiss(id);

      return toast.success(message, { ...opts, id: id });
    },
    [id]
  );

  const error = useCallback(
    (...[message, opts]: Parameters<typeof toast.error>) => {
      toast.dismiss(id);

      return toast.error(message, { ...opts, id: id });
    },
    [id]
  );

  return {
    success,
    error,
  };
};
