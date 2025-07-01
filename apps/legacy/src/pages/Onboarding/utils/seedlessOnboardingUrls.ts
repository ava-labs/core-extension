import { toast } from '@avalabs/core-k2-components';
import { OnboardingURLs } from '@core/types';

export const SEEDLESS_ACTIONS_DEFAULTS = {
  onError: (msg) => toast.error(msg),
  urls: {
    mfaSetup: OnboardingURLs.RECOVERY_METHODS,
    mfaLogin: OnboardingURLs.RECOVERY_METHODS_LOGIN,
  },
} as const;
