import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { ListItem } from '@avalabs/k2-alpine';

import { IconButton } from '@avalabs/k2-alpine';
import {
  useAnalyticsContext,
  useLedgerContext,
  useWalletContext,
} from '@core/ui';

import { openFullscreenTab } from '@core/common';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdExpandMore } from 'react-icons/md';
import { ListItemBody3Text } from './ListItemBody3Text';

export const Connected: FC = () => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { avaxAppVersion: version } = useLedgerContext();
  const { walletDetails } = useWalletContext();

  const derivationPath = walletDetails
    ? walletDetails.derivationPath === DerivationPath.LedgerLive
      ? t('Ledger Live')
      : t('BIP44')
    : t('Unknown');

  return (
    <>
      <ListItem disableGutters divider>
        <ListItemBody3Text primary={t('Ledger Version')} />
        <ListItemBody3Text secondary={version ?? t('Unknown')} />
      </ListItem>
      <ListItem disableGutters>
        <ListItemBody3Text primary={t('Derivation Path')} />
        <ListItemBody3Text secondary={derivationPath} />
        <IconButton
          size="small"
          color="secondary"
          onClick={() => {
            openFullscreenTab('ledger/derivation-path');
            capture('LedgerChangeDerivationPathClicked');
            window.close();
          }}
        >
          <MdExpandMore size={24} />
        </IconButton>
      </ListItem>
    </>
  );
};
