import { Page } from '@/components/Page';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import {
  useLiveBalance,
  useWalletContext,
  useWalletTotalBalance,
  useWalletTotalBalanceContext,
} from '@core/ui';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AddOrConnectWalletButton } from '../AddOrCreateWallet';
import { BulkDeleteButtons } from './components/BulkDeleteButtons';
import * as Styled from './components/Styled';
import { WalletList } from './components/WalletList';
import { useImportWalletSuccess } from './hooks';

const POLLED_BALANCES: TokenType[] = [TokenType.NATIVE, TokenType.ERC20];

export const WalletsHomePage: FC = () => {
  useLiveBalance(POLLED_BALANCES);
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();
  const { fetchWalletBalancesSequentially } = useWalletTotalBalanceContext();
  const { isLoading, hasErrorOccurred } = useWalletTotalBalance(
    walletDetails?.id,
  );

  useEffect(() => {
    fetchWalletBalancesSequentially();
  }, [fetchWalletBalancesSequentially]);

  useImportWalletSuccess();

  return (
    <Page
      title={t('My wallets')}
      titleAction={<AddOrConnectWalletButton />}
      description={t('An overview of your wallets and associated accounts')}
      descriptionProps={{ color: 'text.secondary' }}
      containerProps={{
        gap: 2,
      }}
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
                variant="h6"
                color="error"
                fontSize="14px"
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
