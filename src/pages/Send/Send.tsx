import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { useTranslation } from 'react-i18next';
import { Stack, toast } from '@avalabs/core-k2-components';
import {
  FunctionNames,
  useIsFunctionAvailable,
} from '@src/hooks/useIsFunctionAvailable';
import { FunctionIsUnavailable } from '@src/components/common/FunctionIsUnavailable';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import {
  SupportedProvider,
  getProviderForNetwork,
} from '@src/utils/network/getProviderForNetwork';
import {
  Avalanche,
  BitcoinProvider,
  JsonRpcBatchInternal,
} from '@avalabs/core-wallets-sdk';
import { SendEVM } from './components/SendEVM';
import { toastCardWithLink } from '@src/utils/toastCardWithLink';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { useHistory } from 'react-router-dom';
import { Network } from '@src/background/services/network/models';
import { SendBTC } from './components/SendBTC';
import { LoadingSendForm } from './components/LoadingSendForm';
import { SendPVM } from './components/SendPVM';
import { SendAVM } from './components/SendAVM';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import { isXchainNetwork } from '@src/background/services/network/utils/isAvalancheXchainNetwork';
import {
  isAvmCapableAccount,
  isPvmCapableAccount,
} from './hooks/useSend/models';
import {
  NetworkTokenWithBalance,
  NftTokenWithBalance,
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalanceEVM,
  TokenWithBalancePVM,
} from '@avalabs/vm-module-types';

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
    FunctionNames.SEND
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

  const fromAddress = useMemo(() => {
    if (network?.vmName === NetworkVMType.EVM) {
      return active?.addressC ?? '';
    } else if (network?.vmName === NetworkVMType.BITCOIN) {
      return active?.addressBTC ?? '';
    } else if (isXchainNetwork(network)) {
      return active?.addressAVM ?? '';
    } else if (isPchainNetwork(network)) {
      return active?.addressPVM ?? '';
    }
    return '';
  }, [
    active?.addressAVM,
    active?.addressBTC,
    active?.addressC,
    active?.addressPVM,
    network,
  ]);

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
    [fromAddress, network, captureEncrypted, history, t]
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

  const isNetworkFeeReady = !!networkFee?.low?.maxFeePerGas;
  const isProviderReady =
    provider &&
    network &&
    ((network.vmName === NetworkVMType.EVM &&
      provider instanceof JsonRpcBatchInternal) ||
      ((network.vmName === NetworkVMType.PVM ||
        network.vmName === NetworkVMType.AVM) &&
        provider instanceof Avalanche.JsonRpcProvider) ||
      (network.vmName === NetworkVMType.BITCOIN &&
        provider instanceof BitcoinProvider));

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
    </Stack>
  );
}
