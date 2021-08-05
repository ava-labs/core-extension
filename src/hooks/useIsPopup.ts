import { useMemo } from 'react';
const POPUP_URL = '/popup.html';
export function useIsPopup() {
  return useMemo(() => {
    return window.location.pathname.includes(POPUP_URL);
  }, [window.location.pathname]);
}
