import { useSettingsContext } from '@core/ui';
import { openView } from '@/utils/openView';
import { useCallback } from 'react';

export const useOpenApp = () => {
  const { preferredView } = useSettingsContext();

  return useCallback(() => openView(preferredView), [preferredView]);
};
