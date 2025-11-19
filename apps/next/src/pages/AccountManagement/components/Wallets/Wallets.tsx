import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/components/Page';
import { useWalletContext, useWalletTotalBalance } from '@core/ui';
import { BulkDeleteButtons } from './components/BulkDeleteButtons';
import { WalletList } from './components/WalletList';
import * as Styled from './components/Styled';
import { TokenType } from '@avalabs/vm-module-types';
import { useLiveBalance } from '@core/ui';
import { AddOrConnectWalletButton } from '../AddOrCreateWallet';

const POLLED_BALANCES: TokenType[] = [TokenType.NATIVE, TokenType.ERC20];

export const WalletsHomePage: FC = () => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();
  const { isLoading, hasErrorOccurred } = useWalletTotalBalance(
    walletDetails?.id,
  );

  return (
    <Page
      title={t('My wallets')}
      titleAction={<AddOrConnectWalletButton />}
      description={t('An overview of your wallets and associated accounts')}
      descriptionProps={{ color: 'text.secondary' }}
      withBackButton
      contentProps={{
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      <Stack gap={1.5} flexGrow={1}>
        {!isLoading && hasErrorOccurred && (
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Styled.ErrorIcon size={24} />
              <Typography
                variant="subtitle3"
                color="error"
                whiteSpace="nowrap"
                id="error-message"
              >
                {t('Unable to load balances')}
              </Typography>
            </Stack>
          </Stack>
        )}
        <WalletList />
      </Stack>

      <BulkDeleteButtons />
    </Page>
  );
};
