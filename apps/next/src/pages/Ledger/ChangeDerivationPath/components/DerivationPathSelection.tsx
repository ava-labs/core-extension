import {
  AvalancheLedgerConnector,
  LedgerConnectorOverrides,
} from '@/components/ConnectLedger/LedgerConnector';
import { DerivedKeys } from '@/components/ConnectLedger/LedgerConnector/types';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { DerivationStatus } from '@core/types';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  currentPath: DerivationPath;
  onSuccess: (key: DerivedKeys) => void;
  onStatusChange: (status: DerivationStatus) => void;
};

export const DerivationPathSelection: FC<Props> = ({
  currentPath,
  onSuccess,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const [derivationPathSpec, setDerivationPathSpec] = useState<DerivationPath>(
    currentPath === DerivationPath.BIP44
      ? DerivationPath.LedgerLive
      : DerivationPath.BIP44,
  );

  const overrides = useMemo<LedgerConnectorOverrides['overrides']>(() => {
    const currentLabel = t('Current');
    const addCurrentLabel = (path: DerivationPath, current: DerivationPath) =>
      path === current ? ` (${currentLabel})` : '';
    return {
      PathSelector: {
        labels: {
          [DerivationPath.BIP44]: {
            text: `BIP 44${addCurrentLabel(DerivationPath.BIP44, currentPath)}`,
            disabled: currentPath === DerivationPath.BIP44,
          },
          [DerivationPath.LedgerLive]: {
            text: `Ledger Live${addCurrentLabel(DerivationPath.LedgerLive, currentPath)}`,
            disabled: currentPath === DerivationPath.LedgerLive,
          },
        },
      },
    };
  }, [currentPath, t]);

  return (
    <AvalancheLedgerConnector
      onSuccess={onSuccess}
      onTroubleshoot={() => {}}
      onStatusChange={onStatusChange}
      setDerivationPathSpec={setDerivationPathSpec}
      derivationPathSpec={derivationPathSpec}
      minNumberOfKeys={1}
      overrides={overrides}
    />
  );
};
