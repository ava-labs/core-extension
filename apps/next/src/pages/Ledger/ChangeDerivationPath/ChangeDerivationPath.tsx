import { useTranslation } from 'react-i18next';

import { DerivedKeys } from '@/components/ConnectLedger/LedgerConnector/types';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';
import {
  FullscreenModal,
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useOpenApp } from '@/hooks/useOpenApp';
import { useAnalyticsContext, useWalletContext } from '@core/ui';
import { noop } from 'lodash';
import { ComponentType, FC, useState } from 'react';
import { DerivationPathSelection } from './components/DerivationPathSelection';
import { PrimaryAction } from './components/PrimaryAction';
import { SecondaryAction } from './components/SecondaryAction';
import { SubmissionError } from './components/SubmissionError';
import { Submitted } from './components/Submitted';
import { Submitting } from './components/Submitting';
import { SubmissionState, useSubmit } from './hooks/useSubmit';

const initialDerivedKeys: DerivedKeys = {
  addressPublicKeys: [],
  extendedPublicKeys: [],
};

const submissionComponentMap = {
  idle: undefined,
  submitting: Submitting,
  submitted: Submitted,
  error: SubmissionError,
} as const satisfies Record<SubmissionState, ComponentType<any> | undefined>;

export const ChangeDerivationPath: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const { walletDetails } = useWalletContext();
  const openApp = useOpenApp();

  const [derivedKeys, setDerivedKeys] =
    useState<DerivedKeys>(initialDerivedKeys);

  const onClose = () => {
    capture('LedgerChangeDerivationPathClosed');
    openApp({ closeWindow: true });
  };

  const { submissionState, submit, submissionError } = useSubmit(walletDetails);

  const areKeysReady =
    derivedKeys.addressPublicKeys.length > 0 &&
    (!derivedKeys.extendedPublicKeys ||
      derivedKeys.extendedPublicKeys.length > 0);

  const SubmissionComponent = submissionComponentMap[submissionState];

  return (
    <>
      <FullscreenAnimatedBackground />
      <FullscreenModal open>
        <FullscreenModalTitle>
          {t('Change the Derivation Path')}
        </FullscreenModalTitle>
        <FullscreenModalDescription>
          {submissionState === 'submitted'
            ? t('The derivation path has been changed successfully.')
            : submissionState === 'error'
              ? t(
                  'An error occurred while changing the derivation path. Please try again.',
                )
              : t(
                  'Make sure the Avalanche application is open on your device. Then, select the derivation path type to see your derived addresses.',
                )}
        </FullscreenModalDescription>
        <FullscreenModalContent>
          {SubmissionComponent ? (
            <SubmissionComponent error={submissionError} />
          ) : walletDetails ? (
            <DerivationPathSelection
              currentPath={walletDetails?.derivationPath}
              onSuccess={setDerivedKeys}
              onStatusChange={noop}
            />
          ) : (
            <LoadingScreen />
          )}
        </FullscreenModalContent>
        <FullscreenModalActions>
          <SecondaryAction
            submissionState={submissionState}
            onClose={onClose}
          />
          <PrimaryAction
            submissionState={submissionState}
            onSubmit={() => submit(derivedKeys)}
            disabled={!areKeysReady}
            onClose={onClose}
          />
        </FullscreenModalActions>
      </FullscreenModal>
    </>
  );
};
