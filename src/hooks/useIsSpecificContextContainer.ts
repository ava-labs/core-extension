import { useMemo } from 'react';

export enum ContextContainer {
  POPUP = '/popup.html', // this is extension when it opens
  CONFIRM = '/confirm.html', // this is used for confirms from dApps
  HOME = '/home.html', // This is used for tabs where the wallet is opened
  FULLSCREEN = '/fullscreen.html', // This is used for flows that are performed in a full tab (i.e. first ledger connection, seedless MFA setups, etc.)
  SIDEPANEL = '/sidepanel.html', // This is used for flows that are performed in a full tab (i.e. first ledger connection, seedless MFA setups, etc.)
}

export function useIsSpecificContextContainer(context: ContextContainer) {
  return useMemo(() => {
    return window.location.pathname.includes(context);
  }, [context]);
}
