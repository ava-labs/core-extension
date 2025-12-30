import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { useTranslation } from 'react-i18next';
import { Stack, toast } from '@avalabs/core-k2-components';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';

import { PageTitle } from '@/components/common/PageTitle';
import { useTokensWithBalances } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { FunctionIsOffline } from '@/components/common/FunctionIsOffline';
import { useNetworkContext } from '@core/ui';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { Network } from '@core/types';
import { FunctionIsUnavailable } from '@/components/common/FunctionIsUnavailable';
import { useAccountsContext } from '@core/ui';
import { getProviderForNetwork } from '@core/common';
import { getExplorerAddressByNetwork } from '@core/common';
import { useNetworkFeeContext } from '@core/ui';

import { LoadingSendForm } from '../Send/components/LoadingSendForm';
import { useCollectibleFromParams } from './hooks/useCollectibleFromParams';
import { SendEVMCollectible } from './SendEVMCollectible';
import {
  NetworkTokenWithBalance,
  NftTokenWithBalance,
  TokenType,
} from '@avalabs/vm-module-types';
import { toastCardWithLink } from '@/components/common/toastCardWithLink';

export function CollectibleSend() {
  const { t } = useTranslation();
  const history = useHistory();
  const { network } = useNetworkContext();
  const { networkFee } = useNetworkFeeContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const { captureEncrypted } = useAnalyticsContext();
  const tokens = useTokensWithBalances();
  const { nft } = useCollectibleFromParams();

  const { isFunctionAvailable, isFunctionSupported } = useIsFunctionAvailable({
    functionName: FunctionNames.COLLECTIBLES,
  });

  const nativeToken = tokens.find(({ type }) => type === TokenType.NATIVE);

  const [provider, setProvider] = useState<JsonRpcBatchInternal>();

  useEffect(() => {
    if (!network) {
      setProvider(undefined);
    } else {
      let isMounted = true;

      getProviderForNetwork(network).then((p) => {
        if (isMounted && p instanceof JsonRpcBatchInternal) {
          setProvider(p);
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [network]);

  const fromAddress = useMemo(() => {
    if (network?.vmName === NetworkVMType.EVM) {
      return active?.addressC ?? '';
    }
    return '';
  }, [active?.addressC, network?.vmName]);

  const onSuccess = useCallback(
    (txHash: string) => {
      captureEncrypted('NftSendSucceeded', {
        address: fromAddress,
        txHash,
        chainId: network?.chainId,
        type: nft?.type,
      });

      toastCardWithLink({
        title: t('Send Successful'),
        url: getExplorerAddressByNetwork(network as Network, txHash),
        label: t('View in Explorer'),
      });

      history.push('/home');
    },
    [fromAddress, network, captureEncrypted, history, t, nft?.type],
  );

  const onFailure = useCallback(() => {
    toast.error(t('Transaction Failed'));

    captureEncrypted('NftSendFailed', {
      address: fromAddress,
      chainId: network?.chainId,
      type: nft?.type,
    });
  }, [captureEncrypted, fromAddress, network?.chainId, t, nft?.type]);

  const onApproved = useCallback(() => {
    captureEncrypted('NftSendStarted', {
      address: fromAddress,
      chainId: network?.chainId,
      type: nft?.type,
    });
  }, [captureEncrypted, fromAddress, network?.chainId, nft?.type]);

  const tokenList = useMemo(() => [nft], [nft]);

  if (!isFunctionSupported) {
    return (
      <FunctionIsUnavailable
        functionName={FunctionNames.COLLECTIBLES}
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  if (!isFunctionAvailable) {
    return <FunctionIsOffline functionName={FunctionNames.COLLECTIBLES} />;
  }

  const isLoading =
    !nft ||
    !active ||
    !network ||
    !fromAddress ||
    !provider ||
    !networkFee?.low?.maxFeePerGas ||
    !nativeToken ||
    !tokenList.length;

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <PageTitle>{t('Send')}</PageTitle>
      {isLoading && <LoadingSendForm />}
      {!isLoading && network.vmName === NetworkVMType.EVM && (
        <SendEVMCollectible
          fromAddress={fromAddress}
          network={network}
          maxFee={networkFee.low.maxFeePerGas}
          nativeToken={nativeToken as NetworkTokenWithBalance}
          provider={provider as JsonRpcBatchInternal}
          tokenList={tokenList as [NftTokenWithBalance]}
          onApproved={onApproved}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      )}
      {!isLoading && network.vmName !== NetworkVMType.EVM && (
        <FunctionIsUnavailable
          functionName={FunctionNames.COLLECTIBLES}
          network={network?.chainName || 'Testnet'}
        />
      )}
    </Stack>
  );
}
