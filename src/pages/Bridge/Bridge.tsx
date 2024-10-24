import {
  BIG_ZERO,
  Blockchain,
  useBridgeSDK,
  isAddressBlocklisted,
} from '@avalabs/core-bridge-sdk';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BridgeProviders, useBridge } from './hooks/useBridge';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { useSyncBridgeConfig } from './hooks/useSyncBridgeConfig';
import Big from 'big.js';
import { useSetBridgeChainFromNetwork } from './hooks/useSetBridgeChainFromNetwork';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { BridgeSanctions } from './components/BridgeSanctions';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import {
  blockchainToNetwork,
  networkToBlockchain,
} from './utils/blockchainConversion';
import { useAvailableBlockchains } from './hooks/useAvailableBlockchains';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  ToastCard,
  Typography,
  toast,
} from '@avalabs/core-k2-components';
import { TokenType } from '@avalabs/vm-module-types';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { useErrorMessage } from '@src/hooks/useErrorMessage';
import { isBitcoinNetwork } from '@src/background/services/network/utils/isBitcoinNetwork';

import { BridgeFormETH } from './components/BridgeFormETH';
import { BridgeFormAVAX } from './components/BridgeFormAVAX';
import { BridgeFormBTC } from './components/BridgeFormBTC';
import { BridgeFormUnified } from './components/BridgeFormUnified';
import { useUnifiedBridgeContext } from '@src/contexts/UnifiedBridgeProvider';
import { BridgeUnknownNetwork } from './components/BridgeUnknownNetwork';
import { useLiveBalance } from '@src/hooks/useLiveBalance';

const POLLED_BALANCES = [TokenType.NATIVE, TokenType.ERC20];

export function Bridge() {
  useLiveBalance(POLLED_BALANCES); // Make sure we always use fresh balances of bridgable tokens.
  useSyncBridgeConfig(); // keep bridge config up-to-date
  useSetBridgeChainFromNetwork();

  const [currentAssetIdentifier, setCurrentAssetIdentifier] =
    useState<string>();
  const { amount, setAmount, bridgeFee, provider, minimum, targetChainId } =
    useBridge(currentAssetIdentifier);

  const {
    bridgeConfig,
    currentAsset,
    setCurrentAsset,
    currentBlockchain,
    setCurrentBlockchain,
    targetBlockchain,
    sourceAssets,
  } = useBridgeSDK();
  const bridgeConfigError = bridgeConfig.error;
  const { t } = useTranslation();
  const availableBlockchains = useAvailableBlockchains();
  const { getAssetIdentifierOnTargetChain } = useUnifiedBridgeContext();

  const { isFunctionAvailable } = useIsFunctionAvailable(FunctionNames.BRIDGE);

  const [bridgeError, setBridgeError] = useState<string>('');

  const history = useHistory();
  const { captureEncrypted } = useAnalyticsContext();
  const { getPageHistoryData, setNavigationHistoryData } = usePageHistory();
  const getTranslatedError = useErrorMessage();

  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { network, setNetwork, networks } = useNetworkContext();

  const activeAddress = useMemo(
    () =>
      network
        ? isBitcoinNetwork(network)
          ? activeAccount?.addressBTC
          : activeAccount?.addressC
        : undefined,
    [activeAccount?.addressBTC, activeAccount?.addressC, network]
  );

  const targetNetwork = useMemo(() => {
    if (targetBlockchain) {
      return blockchainToNetwork(targetBlockchain, networks, bridgeConfig);
    }
  }, [bridgeConfig, networks, targetBlockchain]);

  const bridgePageHistoryData: {
    selectedToken?: string;
    inputAmount?: Big;
    selectedTokenAddress?: string;
  } = getPageHistoryData();

  // derive blockchain/network from network
  useEffect(() => {
    const networkBlockchain = networkToBlockchain(network);
    if (currentBlockchain !== networkBlockchain) {
      setCurrentBlockchain(networkBlockchain);
    }
  }, [network, currentBlockchain, setCurrentBlockchain]);

  // Set source blockchain & amount from page storage
  useEffect(() => {
    if (!amount && bridgePageHistoryData.inputAmount) {
      setAmount(new Big(bridgePageHistoryData.inputAmount));
    }
  }, [
    amount,
    bridgePageHistoryData.inputAmount,
    setAmount,
    networks,
    setNetwork,
  ]);

  // Set token from page storage
  useEffect(() => {
    const sourceSymbols = Object.keys(sourceAssets);
    const symbol = bridgePageHistoryData.selectedToken;

    if (
      symbol &&
      !currentAsset &&
      sourceSymbols.length &&
      sourceSymbols.includes(symbol) // make sure we have the selected token available on the network to prevent an infinite loop
    ) {
      // Workaround for a race condition with useEffect in BridgeSDKProvider
      // that also calls setCurrentAsset :(
      const timer = setTimeout(() => {
        setCurrentAsset(symbol);
        setCurrentAssetIdentifier(
          bridgePageHistoryData.selectedTokenAddress ?? ''
        );
      }, 1);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [
    bridgePageHistoryData.selectedToken,
    bridgePageHistoryData.selectedTokenAddress,
    currentAsset,
    currentAssetIdentifier,
    setCurrentAsset,
    sourceAssets,
    bridgeConfig,
    networks,
    targetBlockchain,
  ]);

  const [isAmountTooLow, setIsAmountTooLow] = useState(false);

  const onInitiated = useCallback(() => {
    captureEncrypted('BridgeTransferStarted', {
      address: activeAddress,
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
    });
  }, [captureEncrypted, activeAddress, currentBlockchain, targetBlockchain]);

  const onRejected = useCallback(() => {
    captureEncrypted('BridgeTransferRequestUserRejectedError', {
      address: activeAddress,
      sourceBlockchain: currentBlockchain,
      targetBlockchain,
      fee: bridgeFee?.toNumber(),
    });
  }, [
    activeAddress,
    bridgeFee,
    captureEncrypted,
    currentBlockchain,
    targetBlockchain,
  ]);

  const onFailure = useCallback(
    (transferError: unknown) => {
      setBridgeError(t('There was a problem with the transfer'));
      captureEncrypted('BridgeTransferRequestError', {
        address: activeAddress,
        sourceBlockchain: currentBlockchain,
        targetBlockchain,
      });

      const { title, hint } = getTranslatedError(transferError);

      toast.custom(
        <ToastCard variant="error">
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="caption" color="text.primary">
            {hint}
          </Typography>
        </ToastCard>,
        { duration: 5000 }
      );
    },
    [
      activeAddress,
      captureEncrypted,
      currentBlockchain,
      targetBlockchain,
      getTranslatedError,
      t,
    ]
  );

  const onSuccess = useCallback(
    (hash: string) => {
      captureEncrypted('BridgeTransferRequestSucceeded', {
        address: activeAddress,
        txHash: hash,
        sourceBlockchain: currentBlockchain,
        targetBlockchain,
      });

      const timestamp = Date.now();

      // Navigate to transaction status page
      history.push(
        `/bridge/transaction-status/${currentBlockchain}/${hash}/${timestamp}`
      );
    },
    [
      activeAddress,
      captureEncrypted,
      currentBlockchain,
      history,
      targetBlockchain,
    ]
  );

  const handleBlockchainChange = useCallback(
    (blockchain: Blockchain) => {
      const blockChainNetwork = blockchainToNetwork(
        blockchain,
        networks,
        bridgeConfig
      );

      if (blockChainNetwork) {
        setNetwork(blockChainNetwork);
        const assetAddressOnOppositeChain = getAssetIdentifierOnTargetChain(
          currentAsset,
          blockChainNetwork.caipId
        );

        setCurrentAssetIdentifier(assetAddressOnOppositeChain);
        setNavigationHistoryData({
          selectedTokenAddress: assetAddressOnOppositeChain,
          selectedToken: currentAsset,
          inputAmount: amount,
        });
      }

      // Reset because a denomination change will change its value
      setAmount(BIG_ZERO);
      setBridgeError('');
    },
    [
      amount,
      bridgeConfig,
      getAssetIdentifierOnTargetChain,
      currentAsset,
      networks,
      setAmount,
      setNavigationHistoryData,
      setNetwork,
      setBridgeError,
      setCurrentAssetIdentifier,
    ]
  );

  if (
    bridgeConfigError ||
    !isFunctionAvailable ||
    availableBlockchains.length < 2 // we need at least to blockchains to bridge between
  ) {
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

  if (
    activeAccount &&
    isAddressBlocklisted({
      addressEVM: activeAccount.addressC,
      addressBTC: activeAccount.addressBTC,
      bridgeConfig,
    })
  ) {
    return <BridgeSanctions />;
  }

  const sharedProps = {
    onInitiated,
    onSuccess,
    onFailure,
    onRejected,
    handleBlockchainChange,
    amount,
    availableBlockchains,
    bridgeError,
    isAmountTooLow,
    setIsAmountTooLow,
    provider,
    setAmount,
    setBridgeError,
    setCurrentAssetIdentifier,
    setNavigationHistoryData,
    targetNetwork,
    currentAssetIdentifier,
  };

  if (
    currentBlockchain === Blockchain.UNKNOWN ||
    !availableBlockchains.includes(currentBlockchain)
  ) {
    return <BridgeUnknownNetwork onSelect={handleBlockchainChange} />;
  }

  return (
    <Stack sx={{ height: '100%', width: '100%' }}>
      <PageTitle
        onBackClick={() => {
          // We need to reset the current asset when the user purposefully navigates away from Bridge.
          // That's because this kind of action will clear the data we saved in NavigationHistoryService,
          // therefore leaving us with no "currentAssetIdentifier", without which we cannot distinguish between
          // USDC and USDC.e
          // Closing & reopening of the extension will still work & load the previous form values,
          // because this action does not clear the data in NavigationHistoryService.
          setCurrentAsset('');
          history.replace('/home');
        }}
      >
        {t('Bridge')}
      </PageTitle>
      {provider === BridgeProviders.Avalanche ? (
        <>
          {currentBlockchain === Blockchain.ETHEREUM && (
            <BridgeFormETH
              {...sharedProps}
              bridgeFee={bridgeFee}
              minimum={minimum}
            />
          )}

          {currentBlockchain === Blockchain.BITCOIN && (
            <BridgeFormBTC
              {...sharedProps}
              bridgeFee={bridgeFee}
              minimum={minimum}
            />
          )}

          {currentBlockchain === Blockchain.AVALANCHE && (
            <BridgeFormAVAX
              {...sharedProps}
              bridgeFee={bridgeFee}
              minimum={minimum}
            />
          )}
        </>
      ) : (
        <BridgeFormUnified {...sharedProps} targetChainId={targetChainId} />
      )}
    </Stack>
  );
}

export default Bridge;
