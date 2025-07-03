import { toast } from '@avalabs/k2-alpine';

export const SEEDLESS_ACTIONS_OPTIONS = {
  onError: (msg) => toast.error(msg),
  urls: {
    mfaSetup: '/onboarding/seedless/setup',
    mfaLogin: '/onboarding/seedless/login',
  },
} as const;
