import { FunctionIsOffline } from '@/components/common/FunctionIsOffline';
import { FunctionIsUnavailable } from '@/components/common/FunctionIsUnavailable';
import { PageTitle } from '@/components/common/PageTitle';
import { useAccountsContext } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { useNetworkFeeContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { useTokensWithBalances } from '@core/ui';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { Stack, toast } from '@avalabs/core-k2-components';
import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
  SolanaProvider,
  isSolanaProvider,
} from '@avalabs/core-wallets-sdk';
import {
  NetworkTokenWithBalance,
  NftTokenWithBalance,
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalanceEVM,
  TokenWithBalancePVM,
  TokenWithBalanceSPL,
  TokenWithBalanceSVM,
} from '@avalabs/vm-module-types';
import {
  isAvmCapableAccount,
  isPvmCapableAccount,
  isSvmCapableAccount,
  Network,
} from '@core/types';
import {
  SupportedProvider,
  getAddressForChain,
  getExplorerAddressByNetwork,
  getProviderForNetwork,
} from '@core/common';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LoadingSendForm } from './components/LoadingSendForm';
import { SendAVM } from './components/SendAVM';
import { SendBTC } from './components/SendBTC';
import { SendEVM } from './components/SendEVM';
import { SendPVM } from './components/SendPVM';
import { SendSVM } from './components/SendSVM';
import { toastCardWithLink } from '@/components/common/toastCardWithLink';

export function SendPage() {
  const { t } = useTranslation();
  const history = useHistory();
  const { network } = useNetworkContext();
  const { networkFee } = useNetworkFeeContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const { captureEncrypted } = useAnalyticsContext();
  const tokens = useTokensWithBalances();

  const { isFunctionAvailable, isFunctionSupported } = useIsFunctionAvailable(
    FunctionNames.SEND,
  );

  const nativeToken = tokens.find(({ type }) => type === TokenType.NATIVE);

  const [provider, setProvider] = useState<SupportedProvider>();

  useEffect(() => {
    if (!network) {
      setProvider(undefined);
    } else {
      let isMounted = true;

      getProviderForNetwork(network).then((p) => {
        if (isMounted) {
          setProvider(p);
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [network]);

  const fromAddress = useMemo(
    () => getAddressForChain(network, active),
    [active, network],
  );

  const onSuccess = useCallback(
    (txHash: string) => {
      captureEncrypted('SendSuccessful', {
        address: fromAddress,
        txHash,
        chainId: network?.chainId,
      });

      toastCardWithLink({
        title: t('Send Successful'),
        url: getExplorerAddressByNetwork(network as Network, txHash),
        label: t('View in Explorer'),
      });

      history.push('/home');
    },
    [fromAddress, network, captureEncrypted, history, t],
  );

  const onFailure = useCallback(() => {
    toast.error(t('Transaction Failed'));

    captureEncrypted('SendFailed', {
      address: fromAddress,
      chainId: network?.chainId,
    });
  }, [captureEncrypted, fromAddress, network?.chainId, t]);

  const onApproved = useCallback(() => {
    captureEncrypted('SendApproved', {
      address: fromAddress,
      chainId: network?.chainId,
    });
  }, [captureEncrypted, fromAddress, network?.chainId]);

  if (!isFunctionSupported) {
    return (
      <FunctionIsUnavailable
        functionName={FunctionNames.SEND}
        network={network?.chainName || 'Testnet'}
      />
    );
  }

  if (!isFunctionAvailable) {
    return <FunctionIsOffline functionName={FunctionNames.SEND} />;
  }

  const isNetworkFeeReady =
    typeof networkFee?.low?.maxFeePerGas !== 'undefined';
  const isProviderReady = doesProviderMatchTheNetwork(network, provider);

  const isLoading =
    !active ||
    !network ||
    !fromAddress ||
    !provider ||
    !isNetworkFeeReady ||
    !nativeToken ||
    !isProviderReady;

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <PageTitle>{t('Send')}</PageTitle>
      {isLoading && <LoadingSendForm />}
      {!isLoading && network.vmName === NetworkVMType.EVM && networkFee && (
        <SendEVM
          network={network}
          fromAddress={fromAddress}
          maxFee={networkFee.low.maxFeePerGas}
          nativeToken={nativeToken as NetworkTokenWithBalance}
          provider={provider as JsonRpcBatchInternal}
          tokenList={
            tokens as Exclude<TokenWithBalanceEVM, NftTokenWithBalance>[]
          }
          onSuccess={onSuccess}
          onFailure={onFailure}
          onApproved={onApproved}
        />
      )}
      {!isLoading && network.vmName === NetworkVMType.BITCOIN && networkFee && (
        <SendBTC
          network={network}
          fromAddress={fromAddress}
          maxFee={networkFee.low.maxFeePerGas}
          nativeToken={nativeToken as TokenWithBalanceBTC}
          provider={provider as BitcoinProvider}
          tokenList={tokens as [TokenWithBalanceBTC]}
          onSuccess={onSuccess}
          onFailure={onFailure}
          onApproved={onApproved}
        />
      )}
      {!isLoading &&
        networkFee &&
        network.vmName === NetworkVMType.PVM &&
        isPvmCapableAccount(active) && (
          <SendPVM
            network={network}
            fromAddress={fromAddress}
            maxFee={networkFee.low.maxFeePerGas}
            networkFee={networkFee}
            nativeToken={nativeToken as TokenWithBalancePVM}
            provider={provider as Avalanche.JsonRpcProvider}
            tokenList={tokens as [TokenWithBalancePVM]}
            account={active}
            onSuccess={onSuccess}
            onFailure={onFailure}
            onApproved={onApproved}
          />
        )}
      {!isLoading &&
        network.vmName === NetworkVMType.AVM &&
        isAvmCapableAccount(active) && (
          <SendAVM
            network={network}
            fromAddress={fromAddress}
            maxFee={
              (provider as Avalanche.JsonRpcProvider).getContext().baseTxFee
            }
            nativeToken={nativeToken as TokenWithBalanceAVM}
            provider={provider as Avalanche.JsonRpcProvider}
            tokenList={tokens as [TokenWithBalanceAVM]}
            account={active}
            onSuccess={onSuccess}
            onFailure={onFailure}
            onApproved={onApproved}
          />
        )}
      {!isLoading &&
        network.vmName === NetworkVMType.SVM &&
        isSvmCapableAccount(active) && (
          <SendSVM
            network={network}
            fromAddress={fromAddress}
            maxFee={0n} // Irrelevant for Solana at the moment, since we're only using the fixed, base fee (no priority fees).
            nativeToken={nativeToken as TokenWithBalanceSVM}
            provider={provider as SolanaProvider}
            tokenList={tokens as [TokenWithBalanceSPL]}
            account={active}
            onSuccess={onSuccess}
            onFailure={onFailure}
            onApproved={onApproved}
          />
        )}
    </Stack>
  );
}

// Helper utility for checking if the provider network & provider match.
// This is useful, since updates of `network` and `provider` may come
// in different render runs, in which case we should still wait.
const doesProviderMatchTheNetwork = (
  network?: Network,
  provider?: SupportedProvider,
) => {
  if (!network || !provider) {
    return false;
  }

  switch (network.vmName) {
    case NetworkVMType.SVM:
      return isSolanaProvider(provider);
    case NetworkVMType.EVM:
      return provider instanceof JsonRpcBatchInternal;

    case NetworkVMType.AVM:
    case NetworkVMType.PVM:
      return provider instanceof Avalanche.JsonRpcProvider;

    case NetworkVMType.BITCOIN:
      return provider instanceof BitcoinProvider;

    default:
      return false;
  }
};
