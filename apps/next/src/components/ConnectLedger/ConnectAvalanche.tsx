import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { Stack, StackProps } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

import { SecretType } from '@core/types';
import {
  type ConnectorCallbacks,
  type DerivationStatus,
  AvalancheLedgerConnector,
} from './LedgerConnector';
import { DerivedKeys } from './LedgerConnector/types';
import * as Styled from './Styled';

type ConnectionStepProps = StackProps & {
  onNext: (
    keys: DerivedKeys,
    secretType: SecretType.Ledger | SecretType.LedgerLive,
  ) => void;
  onTroubleshoot: () => void;
  connectorCallbacks?: ConnectorCallbacks;
};

export const ConnectAvalanche: FC<ConnectionStepProps> = ({
  onNext,
  onTroubleshoot,
  connectorCallbacks,
  ...stackProps
}) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<DerivationStatus>('waiting');
  const [derivationPathSpec, setDerivationPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44,
  );

  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>({
    addressPublicKeys: [],
    extendedPublicKeys: [],
  });

  const isValid =
    derivationPathSpec === DerivationPath.BIP44
      ? Boolean(
          derivedKeys.addressPublicKeys.length &&
            derivedKeys.extendedPublicKeys?.length,
        )
      : derivedKeys.addressPublicKeys.length > 0;

  return (
    <Stack height="100%" width="100%" {...stackProps}>
      <FullscreenModalTitle>{t('Connect your Ledger')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {status === 'error'
          ? t(
              'Please connect your device, open the Avalanche application, and connect the wallet with the Ledger option to continue.',
            )
          : status === 'needs-user-gesture'
            ? t(
                'Please make sure your device is connected and unlocked, then click the button below.',
              )
            : t(
                'Make sure the Avalanche application is open on your device. Then, select the derivation path type to see your derived addresses.',
              )}
      </FullscreenModalDescription>
      <FullscreenModalContent sx={{ gap: 3, alignItems: 'center' }}>
        <AvalancheLedgerConnector
          callbacks={connectorCallbacks}
          onSuccess={setDerivedKeys}
          onTroubleshoot={onTroubleshoot}
          onStatusChange={setStatus}
          setDerivationPathSpec={setDerivationPathSpec}
          derivationPathSpec={derivationPathSpec}
          minNumberOfKeys={1}
        />
      </FullscreenModalContent>
      <FullscreenModalActions>
        {status === 'error' ? (
          <Stack width="100%" justifyContent="center" alignItems="center">
            <Styled.LedgerLiveButton>
              {t('Download Ledger Live to update')}
            </Styled.LedgerLiveButton>
          </Stack>
        ) : (
          <NavButton
            disabled={!isValid}
            color="primary"
            loading={
              status === 'ready' && derivedKeys.addressPublicKeys.length === 0
            }
            onClick={() =>
              onNext(
                derivedKeys,
                derivationPathSpec === DerivationPath.BIP44
                  ? SecretType.Ledger
                  : SecretType.LedgerLive,
              )
            }
          >
            {t('Next')}
          </NavButton>
        )}
      </FullscreenModalActions>
    </Stack>
  );
};
