import { Button } from '@avalabs/k2-alpine';
import { openFullscreenTab } from '@core/common';
import { useWalletContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ChainListItem } from './ChainListItem';
import { HoverableListItemButton } from './HoverableListItemButton';
import { AddressEnablerProps } from './types';

const openSolanaDerivationScreen = () => {
  openFullscreenTab('ledger/derive-solana-addresses');
};

export const SolanaAddressEnabler: FC<AddressEnablerProps> = ({
  visibility = 'hover',
  Icon,
  label,
  labelVariant,
}) => {
  const { isLedgerWallet } = useWalletContext();
  const { t } = useTranslation();

  if (!isLedgerWallet) {
    return null;
  }

  const ActionButton =
    visibility === 'hover' ? HoverableListItemButton : Button;
  return (
    <ChainListItem
      Icon={Icon}
      label={label}
      labelVariant={labelVariant}
      action={
        <ActionButton
          variant="contained"
          color="secondary"
          size="xsmall"
          onClick={openSolanaDerivationScreen}
        >
          {t('Enable')}
        </ActionButton>
      }
    />
  );
};
