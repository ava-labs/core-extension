import { FC } from 'react';

import { useImportMissingKeysFromKeystone } from '@core/ui';

import {
  LedgerRegisterBtcWalletPolicy,
  LedgerIncorrectDevice,
} from '@/components/ledger';
import { useSeedlessMissingKeysDerivation } from '@/hooks/seedless';

/**
 * This is a container component where you can place event-driven global components
 * and hooks.
 *
 * Things like:
 *   "This device you just connected is not the same as the one that you created this wallet with."
 * or
 *   "Looks like you're missing some addresses. Let's derive them for you."
 *
 * Things like are not specific to a single page/screen, but rather the wallet as a whole,
 * and they also need access to the context providers (e.g. useWalletContext, useLedgerContext, etc.).
 *
 * This will help App.tsx file more concise and easier to maintain.
 */
export const EventDrivenComponentsAndHooks: FC = () => {
  useSeedlessMissingKeysDerivation();
  useImportMissingKeysFromKeystone();

  return (
    <>
      <LedgerRegisterBtcWalletPolicy />
      <LedgerIncorrectDevice />
    </>
  );
};
