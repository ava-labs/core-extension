import { useMemo } from 'react';

export enum ContextContainer {
  POPUP = '/popup.html', // this is extension when it opens
  CONFIRM = '/confirm.html', // this is used for confirms from dApps
  HOME = '/home.html', // This is used for tabs where the wallet is opened
}

export function useIsSpecificContextContainer(context: ContextContainer) {
  return useMemo(() => {
    return window.location.pathname.includes(context);
  }, [context]);
}
