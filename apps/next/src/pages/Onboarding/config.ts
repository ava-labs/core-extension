import { toast } from '@core/ui';

export const SEEDLESS_ACTIONS_OPTIONS = {
  onError: (msg) => toast.error(msg),
  urls: {
    mfaSetup: '/onboarding/seedless/setup',
    mfaLogin: '/onboarding/seedless/login',
  },
} as const;
