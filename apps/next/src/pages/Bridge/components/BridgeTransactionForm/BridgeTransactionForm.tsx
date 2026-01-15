import { AccountSelect } from '@/components/AccountSelect';
import { Stack } from '@avalabs/k2-alpine';
import { handleTxOutcome, stringToBigint } from '@core/common';
import { useAccountsContext } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../../contexts';
import { TransferResult, useBridgeFormStateHandler } from '../../hooks';
import { BitcoinBridgeInfo } from '../BitcoinBridgeInfo';
import {
  BannerTop,
  BridgeControls,
  BridgeErrorMessage,
  BridgeProviderNotice,
} from './components';
import { TxButton } from '@/components/TxButton';

type Props = {
  onSuccess(result: TransferResult): void;
  onRejected(result: TransferResult): void;
  onFailure(error: unknown): void;
};

export const BridgeTransactionForm: FC<Props> = ({
  onSuccess,
  onRejected,
  onFailure,
}) => {
  const { t } = useTranslation();
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();

  const [accountQuery, setAccountQuery] = useState('');
  const {
    transferAsset,
    asset,
    query: {
      amount,
      updateQuery,
      sourceNetwork: sourceNetworkId,
      targetNetwork: targetNetworkId,
    },
  } = useBridgeState();

  const {
    isBridgeButtonDisabled,
    error,
    isBridgeExecuting,
    setIsBridgeExecuting,
  } = useBridgeFormStateHandler();

  const performBridge = async () => {
    const canExecuteBridge = asset && amount && targetNetworkId;

    if (!canExecuteBridge) {
      return;
    }

    setIsBridgeExecuting(true);

    try {
      const result = await handleTxOutcome(
        transferAsset(
          asset.symbol,
          stringToBigint(amount, asset.decimals),
          sourceNetworkId,
          targetNetworkId,
        ),
      );

      if (result.isApproved) {
        onSuccess(result);
      } else {
        onRejected(result);
      }
    } catch (txError) {
      onFailure(txError);
    } finally {
      setIsBridgeExecuting(false);
    }
  };

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
      <BridgeErrorMessage formError={error} />
      <BitcoinBridgeInfo />
      <Stack
        width="100%"
        flexGrow={1}
        justifyContent="flex-end"
        gap={1}
        textAlign="center"
      >
        <BridgeProviderNotice />
        <TxButton
          isLoading={isBridgeExecuting}
          onClick={performBridge}
          isDisabled={isBridgeButtonDisabled}
          title={t('Bridge')}
        />
      </Stack>
    </>
  );
};
