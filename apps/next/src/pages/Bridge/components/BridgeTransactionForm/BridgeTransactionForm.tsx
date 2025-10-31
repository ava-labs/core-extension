import { AccountSelect } from '@/components/AccountSelect';
import { Button, Stack } from '@avalabs/k2-alpine';
import { stringToBigint } from '@core/common';
import { useAccountsContext } from '@core/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../../contexts';
import { useBridgeErrorHandler } from '../../hooks';
import {
  BannerTop,
  BridgeControls,
  BridgeErrorMessage,
  BridgeProviderNotice,
  CoreFeeNotice,
} from './components';

export const BridgeTransactionForm = () => {
  const { t } = useTranslation();
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();
  const [accountQuery, setAccountQuery] = useState('');
  const {
    transferAsset,
    asset: target,
    query: {
      amount,
      updateQuery,
      transactionId,
      sourceNetwork: sourceNetworkId,
    },
    targetNetworkId,
    state,
    isTxConfirming,
  } = useBridgeState();

  const {
    error: bridgeError,
    onBridgeError,
    clearError,
  } = useBridgeErrorHandler();

  const canExecuteBridge = target && amount && targetNetworkId;

  const performBridge = () => {
    if (!canExecuteBridge) {
      return;
    }

    transferAsset(
      target.symbol,
      stringToBigint(amount, target.decimals),
      sourceNetworkId,
      targetNetworkId,
    )
      .then((txId) => {
        if (txId) {
          updateQuery({
            transactionId: txId,
          });
          clearError();
        } else {
          throw new Error('Missing tx hash');
        }
      })
      .catch((err) => {
        console.error(err);
        onBridgeError(err, t('Failed to bridge'));
      });
  };

  console.log('UNI BRIDGE STATE', state);

  const isAmountLoading = false;
  const isConfirming = isTxConfirming(transactionId);
  const isBridgeButtonDisabled = isConfirming || isAmountLoading;
  return (
    <>
      <Stack gap={1}>
        <BannerTop />
        <AccountSelect
          addressType="C"
          value={active}
          query={accountQuery}
          onValueChange={(newAccount) => {
            selectAccount(newAccount.id);
            updateQuery({
              amount: '',
            });
          }}
          onQueryChange={setAccountQuery}
        />
        <BridgeControls />
      </Stack>
      <BridgeErrorMessage error={bridgeError} />
      <CoreFeeNotice />
      <Stack
        width="100%"
        flexGrow={1}
        justifyContent="flex-end"
        gap={1}
        textAlign="center"
      >
        <BridgeProviderNotice />
        <Button
          fullWidth
          size="extension"
          variant="contained"
          color="primary"
          onClick={performBridge}
          disabled={isBridgeButtonDisabled}
          loading={isBridgeButtonDisabled}
        >
          {t('Bridge')}
        </Button>
      </Stack>
    </>
  );
};
