import { AccountSelect } from '@/components/AccountSelect';
import { Button, Stack } from '@avalabs/k2-alpine';
import { handleTxOutcome, stringToBigint } from '@core/common';
import { useAccountsContext } from '@core/ui';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../../contexts';
import { TransferResult, useBridgeFormStateHandler } from '../../hooks';
import {
  BannerTop,
  BridgeControls,
  BridgeErrorMessage,
  BridgeEstimatedTimeWarning,
  BridgeProviderNotice,
} from './components';

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

  // NOTE: we operate on the assumption that UnifiedBridge SDK will
  // use the first matching bridge from the `destinations` array
  const [bridgeType] = asset?.destinations[targetNetworkId ?? ''] ?? [];

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
      {!error && bridgeType && (
        <BridgeEstimatedTimeWarning bridgeType={bridgeType} />
      )}
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
          loading={isBridgeExecuting}
        >
          {t('Bridge')}
        </Button>
      </Stack>
    </>
  );
};
