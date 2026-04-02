import { FC, useState } from 'react';
import { Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { useAccountsContext, useIsUsingKeystone3Wallet } from '@core/ui';

import { ChainListItem } from '../ChainListItem';
import { HoverableListItemButton } from '../HoverableListItemButton';
import { AddressEnablerProps } from '../types';

import { XPChainAddressImportPrompt } from './components/XPChainAddressImportPrompt';

export const XPChainAddressEnabler: FC<AddressEnablerProps> = ({
  visibility = 'hover',
  Icon,
  label,
  labelVariant,
  invertTheme = false,
}) => {
  const isKeystoneUsbWallet = useIsUsingKeystone3Wallet();
  const { t } = useTranslation();
  const { getAccountByIndex } = useAccountsContext();

  const firstAccount = getAccountByIndex(0);

  const [isPromptVisible, setIsPromptVisible] = useState(false);

  if (!isKeystoneUsbWallet || !firstAccount) {
    return null;
  }

  const ActionButton =
    visibility === 'hover' ? HoverableListItemButton : Button;

  return (
    <>
      <ChainListItem
        Icon={Icon}
        label={label}
        labelVariant={labelVariant}
        action={
          <ActionButton
            variant="contained"
            color="secondary"
            size="xsmall"
            onClick={() => setIsPromptVisible(true)}
          >
            {t('Enable')}
          </ActionButton>
        }
      />
      <XPChainAddressImportPrompt
        open={isPromptVisible}
        onClose={() => setIsPromptVisible(false)}
        firstAccount={firstAccount}
        invertTheme={invertTheme}
      />
    </>
  );
};

export const XPChainAddressEnablerInverted: FC<AddressEnablerProps> = ({
  invertTheme: _,
  ...props
}) => <XPChainAddressEnabler {...props} invertTheme />;
