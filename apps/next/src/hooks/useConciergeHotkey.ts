import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useFeatureFlagContext, useSettingsContext } from '@core/ui';
import { FeatureGates } from '@core/types';

export const useConciergeHotkey = () => {
  const history = useHistory();
  const { coreAssistant } = useSettingsContext();
  const { featureFlags } = useFeatureFlagContext();

  useEffect(() => {
    if (!coreAssistant || !featureFlags[FeatureGates.CORE_ASSISTANT]) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        history.push('/concierge');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [history, coreAssistant, featureFlags]);
};
