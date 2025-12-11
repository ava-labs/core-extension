import { useTranslation } from 'react-i18next';

import { AvalancheLedgerConnector } from '@/components/ConnectLedger/LedgerConnector';
import {
  ConnectorCallbacks,
  DerivationStatus,
  DerivedKeys,
} from '@/components/ConnectLedger/LedgerConnector/types';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';
import {
  FullscreenModal,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { toast } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
import { FC, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const ChangeDerivationPath: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { history } = useHistory();
  const [status, setStatus] = useState<DerivationStatus>('waiting');
  const [derivationPathSpec, setDerivationPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44,
  );
  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>({
    addressPublicKeys: [],
    extendedPublicKeys: [],
  });

  const callbacks = useMemo<ConnectorCallbacks>(
    () => ({
      onConnectionSuccess: () =>
        toast.success(t('Derivation path changed successfully')),
      onConnectionFailed: (error) =>
        toast.error(
          t('Failed to change derivation path: {{error}}', {
            error: error.message,
          }),
        ),
      onConnectionRetry: () =>
        toast.info(t('Retrying to change derivation path...')),
    }),
    [t],
  );
  return (
    <>
      <FullscreenAnimatedBackground />
      <FullscreenModal open>
        <FullscreenModalTitle>
          {t('Reconnect your Ledger')}
        </FullscreenModalTitle>
        <FullscreenModalDescription>
          {t(
            'It seems that Core no longer has access to your Ledger device. Please click the button below to reconnect it.',
          )}
        </FullscreenModalDescription>
        <FullscreenModalContent>
          <AvalancheLedgerConnector
            callbacks={callbacks}
            onSuccess={setDerivedKeys}
            onTroubleshoot={() => {}}
            onStatusChange={setStatus}
            setDerivationPathSpec={setDerivationPathSpec}
            derivationPathSpec={derivationPathSpec}
            minNumberOfKeys={1}
          />
        </FullscreenModalContent>
      </FullscreenModal>
    </>
  );
};
