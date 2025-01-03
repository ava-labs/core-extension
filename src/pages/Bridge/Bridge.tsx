import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  ToastCard,
  Typography,
  toast,
} from '@avalabs/core-k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { TokenType } from '@avalabs/vm-module-types';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { useErrorMessage } from '@src/hooks/useErrorMessage';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';
import { useLiveBalance } from '@src/hooks/useLiveBalance';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';

import { useBridge } from './hooks/useBridge';
import { BridgeForm } from './components/BridgeForm';
import { BridgeUnknownNetwork } from './components/BridgeUnknownNetwork';
import { useBridgeTxHandling } from './hooks/useBridgeTxHandling';
import { BridgeFormSkeleton } from './components/BridgeFormSkeleton';
import { BridgeSanctions } from './components/BridgeSanctions';
import { isAddressBlockedError } from './utils/isAddressBlockedError';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export function Bridge() {
  useLiveBalance(POLLED_BALANCES); // Make sure we always use the latest balances.

  const {
    amount,
    setAmount,
    bridgableTokens,
    availableChainIds,
    bridgeFee,
    estimateGas,
    isReady,
    minimum,
    maximum,
    receiveAmount,
    setTargetChain,
    possibleTargetChains,
    asset,
    setAsset,
    targetChain,
    transferableAssets,
    sourceBalance,
    transfer,
  } = useBridge();

  const { t } = useTranslation();

  const { isFunctionAvailable } = useIsFunctionAvailable(FunctionNames.BRIDGE);

  const [bridgeError, setBridgeError] = useState<string>('');

  const history = useHistory();
  const { captureEncrypted } = useAnalyticsContext();
  const { networkFee } = useNetworkFeeContext();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const getTranslatedError = useErrorMessage();

  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network, setNetwork } = useNetworkContext();

  const activeAddress = useMemo(
    () =>
      network
        ? isBitcoinNetwork(network)
          ? activeAccount?.addressBTC
          : activeAccount?.addressC
        : undefined,
    [activeAccount?.addressBTC, activeAccount?.addressC, network],
  );

  const bridgePageHistoryData: {
    selectedToken?: string;
    inputAmount?: string;
    isLoading: boolean;
  } = getPageHistoryData();

  useEffect(() => {
    if (!asset && bridgePageHistoryData.selectedToken) {
      const matchingAsset = transferableAssets.find(
        (a) => a.symbol === bridgePageHistoryData.selectedToken,
      );

      if (matchingAsset) {
        setAsset(matchingAsset);
      }
    }
    if (typeof amount !== 'bigint' && bridgePageHistoryData.inputAmount) {
      setAmount(BigInt(bridgePageHistoryData.inputAmount));
    }
  }, [
    amount,
    asset,
    setAsset,
    transferableAssets,
    bridgePageHistoryData.inputAmount,
    bridgePageHistoryData.selectedToken,
    setAmount,
  ]);

  useEffect(() => {
    if (!asset || transferableAssets.length === 0) {
      return;
    }

    const sourceSymbols = transferableAssets.map(({ symbol }) => symbol);
    const prevSymbol = asset.symbol;

    if (prevSymbol && sourceSymbols.length) {
      const prevAsset = transferableAssets.find(
        ({ symbol }) => symbol === prevSymbol,
      );

      if (prevAsset) {
        setAsset(prevAsset);
      }
    }
  }, [asset, setAsset, transferableAssets]);

  const [isAmountTooLow, setIsAmountTooLow] = useState(false);

  const onInitiated = useCallback(() => {
    captureEncrypted('BridgeTransferStarted', {
      address: activeAddress,
      sourceBlockchain: network?.caipId,
      targetBlockchain: targetChain?.caipId,
    });
  }, [captureEncrypted, activeAddress, network?.caipId, targetChain?.caipId]);

  const onRejected = useCallback(() => {
    captureEncrypted('BridgeTransferRequestUserRejectedError', {
      address: activeAddress,
      sourceBlockchain: network?.caipId,
      targetBlockchain: targetChain?.caipId,
      fee: Number(bridgeFee ?? 0),
    });
  }, [
    activeAddress,
    captureEncrypted,
    network?.caipId,
    targetChain?.caipId,
    bridgeFee,
  ]);

  const [isAddressBlocked, setIsAddressBlocked] = useState(false);

  const onFailure = useCallback(
    (transferError: unknown) => {
      setBridgeError(t('There was a problem with the transfer'));
      captureEncrypted('BridgeTransferRequestError', {
        address: activeAddress,
        sourceBlockchain: network?.caipId,
        targetBlockchain: targetChain?.caipId,
      });

      if (isAddressBlockedError(transferError)) {
        setIsAddressBlocked(true);
        return;
      }

      const { title, hint } = getTranslatedError(transferError);

      toast.custom(
        <ToastCard variant="error">
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" color="text.primary">
            {hint}
          </Typography>
        </ToastCard>,
        { duration: 5000 },
      );
    },
    [
      activeAddress,
      captureEncrypted,
      getTranslatedError,
      network?.caipId,
      t,
      targetChain?.caipId,
    ],
  );

  const onSuccess = useCallback(
    (hash: string) => {
      captureEncrypted('BridgeTransferRequestSucceeded', {
        address: activeAddress,
        txHash: hash,
        sourceBlockchain: network?.caipId,
        targetBlockchain: targetChain?.caipId,
      });

      const timestamp = Date.now();

      // Navigate to transaction status page
      history.push(
        `/bridge/transaction-status/${network?.caipId}/${hash}/${timestamp}`,
      );
    },
    [
      activeAddress,
      captureEncrypted,
      history,
      network?.caipId,
      targetChain?.caipId,
    ],
  );

  const handleSourceChainChange = useCallback(
    (chain: NetworkWithCaipId) => {
      setNetwork(chain);
      setNavigationHistoryData({
        selectedToken: asset ? asset.symbol : undefined,
        inputAmount: amount,
      });

      // Reset because a denomination change will change its value
      setAmount(0n);
      setBridgeError('');
    },
    [
      amount,
      asset,
      setAmount,
      setNavigationHistoryData,
      setNetwork,
      setBridgeError,
    ],
  );

  const { onTransfer, isPending } = useBridgeTxHandling({
    transfer,
    onInitiated,
    onSuccess,
    onFailure,
    onRejected,
  });

  const formProps = {
    onInitiated,
    onSuccess,
    onFailure,
    onRejected,
    handleSourceChainChange,
    amount,
    bridgeError,
    isAmountTooLow,
    isReady,
    asset,
    setAsset,
    availableChainIds,
    transferableAssets,
    transfer,
    onTransfer,
    isPending,
    setIsAmountTooLow,
    setAmount,
    setBridgeError,
    setNavigationHistoryData,
    targetChain,
    estimateGas,
    minimum,
    maximum,
    receiveAmount,
    setTargetChain,
    possibleTargetChains,
    bridgableTokens,
    sourceBalance,
  };

  if (!isFunctionAvailable) {
    return (
      <FunctionIsOffline functionName={FunctionNames.BRIDGE}>
        <Button
          href="https://status.avax.network/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mt: 3,
          }}
        >
          {t('Go to the status page')}
        </Button>
      </FunctionIsOffline>
    );
  }

  if (isAddressBlocked) {
    return <BridgeSanctions />;
  }

  if (isReady && transferableAssets.length === 0) {
    return (
      <BridgeUnknownNetwork
        onSelect={handleSourceChainChange}
        availableChainIds={availableChainIds}
        network={network}
      />
    );
  }

  return (
    <Stack sx={{ height: '100%', width: '100%' }}>
      <PageTitle
        onBackClick={() => {
          history.replace('/home');
        }}
      >
        {t('Bridge')}
      </PageTitle>
      {isReady && networkFee ? (
        <BridgeForm {...formProps} networkFee={networkFee} />
      ) : (
        <BridgeFormSkeleton />
      )}
    </Stack>
  );
}

export default Bridge;
