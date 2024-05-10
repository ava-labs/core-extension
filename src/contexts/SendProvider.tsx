import { createContext, useCallback, useContext, useMemo } from 'react';
import { useNetworkContext } from './NetworkProvider';
import { useAccountsContext } from './AccountsProvider';
import { useFeatureFlagContext } from './FeatureFlagsProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { Avalanche } from '@avalabs/wallets-sdk';
import BN from 'bn.js';
import { isPchainNetwork } from '@src/background/services/network/utils/isAvalanchePchainNetwork';
import {
  SendErrorMessage,
  SendState,
} from '@src/background/services/send/models';
import { SendableToken } from '@src/background/services/balances/models';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { useConnectionContext } from './ConnectionProvider';
import { AvalancheSendTransactionHandler } from '@src/background/services/wallet/handlers/avalanche_sendTransaction';
import { LEDGER_TX_SIZE_LIMIT_BYTES } from '@src/background/services/ledger/models';
import { useWalletContext } from './WalletProvider';
import { utils } from '@avalabs/avalanchejs';
import { stripAddressPrefix } from '@src/utils/stripAddressPrefix';
import { isValidPvmAddress } from '@src/utils/isAddressValid';
import { useAnalyticsContext } from './AnalyticsProvider';
import { isString } from 'lodash';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { resolve } from '@src/utils/promiseResolver';

const MAX_LEDGER_OUTPUTS = 64;
const PCHAIN_ALIAS = 'P';

const SendContext = createContext<{
  getNetworkFee(): BN;
  validateStateAndCalculateFees(sendState: SendState): Promise<SendState<any>>;
  send(sendState: SendState): Promise<string>;
}>({} as any);

export function SendContextProvider<T extends SendableToken = SendableToken>({
  children,
}: {
  children: any;
}) {
  const { request } = useConnectionContext();
  const { network: activeNetwork } = useNetworkContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { featureFlags } = useFeatureFlagContext();
  const { isLedgerWallet } = useWalletContext();

  const { captureEncrypted } = useAnalyticsContext();

  const provider = useMemo(() => {
    if (!activeNetwork) {
      return;
    }

    const fetchedProvider = getProviderForNetwork(activeNetwork);

    if (fetchedProvider instanceof Avalanche.JsonRpcProvider) {
      return fetchedProvider;
    }
  }, [activeNetwork]);

  const getFilteredUtxos = useCallback(
    async (wallet: Avalanche.AddressWallet) => {
      if (!provider) {
        throw new Error('Unable to get provider');
      }
      const utxos = await wallet.getUTXOs(PCHAIN_ALIAS);
      let filteredUtxos = Avalanche.sortUTXOsByAmount(utxos.getUTXOs(), true);

      try {
        filteredUtxos = Avalanche.getMaximumUtxoSet(
          wallet,
          utxos.getUTXOs(),
          Avalanche.SizeSupportedTx.BaseP,
          isLedgerWallet ? LEDGER_TX_SIZE_LIMIT_BYTES : undefined
        );
      } catch (error) {
        console.error('Error calculating maximum utxo set', {
          e: error,
          txType: Avalanche.SizeSupportedTx.BaseP,
          utxos,
        });
      }
      filteredUtxos = isLedgerWallet
        ? filteredUtxos.slice(0, MAX_LEDGER_OUTPUTS)
        : filteredUtxos;

      const utxoSet = new utils.UtxoSet(filteredUtxos);
      const avax = provider.getAvaxID();
      return {
        utxos: utxoSet,
        balance: Avalanche.getAssetBalance(utxoSet, avax),
      };
    },
    [isLedgerWallet, provider]
  );

  const getWallet = useCallback(async () => {
    if (!provider) {
      throw new Error('Unable to get provider');
    }

    if (
      !activeAccount ||
      !activeAccount.addressCoreEth ||
      !activeAccount.addressPVM
    ) {
      throw new Error('Active account info missing');
    }

    return new Avalanche.AddressWallet(
      activeAccount.addressC,
      stripAddressPrefix(activeAccount.addressCoreEth),
      [stripAddressPrefix(activeAccount.addressPVM)],
      stripAddressPrefix(activeAccount.addressPVM),
      provider
    );
  }, [activeAccount, provider]);

  const getNetworkFee = useCallback(() => {
    if (!activeNetwork || !isPchainNetwork(activeNetwork)) {
      throw new Error('Unsupported network');
    }
    if (!activeAccount || !activeAccount.addressPVM) {
      throw new Error('Account address missing');
    }
    if (!featureFlags[FeatureGates.SEND_P_CHAIN]) {
      throw new Error(
        `Feature (SEND) on this network is currently unavailable`
      );
    }
    if (!provider) {
      throw new Error('Unable to get provider');
    }

    const staticBaseTxFee = new BN(provider.getContext().baseTxFee.toString());

    return staticBaseTxFee;
  }, [activeAccount, activeNetwork, featureFlags, provider]);

  const getErrorState = useCallback(
    (sendState: SendState<T>, errorMessage: string): SendState<T> => {
      return {
        ...sendState,
        error: { error: true, message: errorMessage },
        canSubmit: false,
      };
    },
    []
  );

  const pchainValidateStateAndCalculateFees = useCallback(
    async (sendState: SendState<T>): Promise<SendState<T>> => {
      if (isLedgerWallet) {
        return getErrorState(
          sendState,
          'Ledger does not support send function on P-Chain currently'
        );
      }

      // Without token, cannot calculate fees. So returning error state quickly
      if (!sendState.token) {
        const errorState = getErrorState(sendState, 'Invalid token');
        return {
          ...errorState,
          maxAmount: undefined,
        };
      }

      const newState = {
        ...sendState,
        canSubmit: true,
        isValidating: false,
        error: undefined,
      };
      const { address, amount } = sendState;
      const [wallet, walletError] = await resolve(getWallet());

      if (walletError) {
        return getErrorState(sendState, 'Unable to construct wallet');
      }

      // using filtered UTXOs because there is size limit
      const [utxos, utxosError] = await resolve(getFilteredUtxos(wallet));

      if (utxosError) {
        return getErrorState(sendState, 'Unable to fetch UTXOs');
      }
      // maxMount calculation
      const available = new BN(utxos?.balance.available.toString() ?? '0');
      const staticBaseTxFee = getNetworkFee();
      const maxAmount = available.sub(staticBaseTxFee);
      newState.maxAmount = maxAmount.gte(new BN(0)) ? maxAmount : new BN(0);

      // Validations
      if (!address)
        return getErrorState(newState, SendErrorMessage.ADDRESS_REQUIRED);

      if (!isValidPvmAddress(address))
        return getErrorState(newState, SendErrorMessage.INVALID_ADDRESS);

      if (!amount || amount.isZero())
        return getErrorState(newState, SendErrorMessage.AMOUNT_REQUIRED);

      if (amount.gt(newState.maxAmount))
        return getErrorState(newState, SendErrorMessage.INSUFFICIENT_BALANCE);

      return {
        ...newState,
        isValidating: false,
        loading: false,
      };
    },
    [isLedgerWallet, getWallet, getFilteredUtxos, getNetworkFee, getErrorState]
  );

  const validateStateAndCalculateFees = useCallback(
    async (sendState: SendState<T>): Promise<SendState<T>> => {
      if (isPchainNetwork(activeNetwork)) {
        return await pchainValidateStateAndCalculateFees(sendState);
      }
      throw new Error('Unsupported network');
    },
    [activeNetwork, pchainValidateStateAndCalculateFees]
  );

  const pchainSend = useCallback(
    async (sendState: SendState) => {
      if (isLedgerWallet) {
        throw new Error(
          'Ledger does not support send function on P-chain currently'
        );
      }

      if (!sendState.address) {
        throw new Error('Missing recipient address');
      }
      if (!sendState.amount) {
        throw new Error('Missing send amount');
      }
      if (!activeNetwork || !isPchainNetwork(activeNetwork)) {
        throw new Error('Unsupported network');
      }
      if (!provider) {
        throw new Error('Unable to get provider');
      }
      const wallet = await getWallet();
      const utxos = await getFilteredUtxos(wallet);

      const avax = provider.getAvaxID();

      const amount = BigInt(sendState.amount.toString());

      const unsignedTx = wallet.baseTX(
        utxos.utxos,
        PCHAIN_ALIAS,
        sendState.address,
        {
          [avax]: amount,
        }
      );

      try {
        const txID = await request<AvalancheSendTransactionHandler>({
          method: DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
          params: {
            transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
            chainAlias: PCHAIN_ALIAS,
          },
        });
        if (isString(txID)) {
          captureEncrypted('SendSuccessful', {
            address: activeAccount?.addressPVM,
            txHash: txID,
            chainId: activeNetwork.chainId,
          });

          return txID;
        }
      } catch {
        captureEncrypted('SendFailed', {
          address: activeAccount?.addressPVM,
          chainId: activeNetwork.chainId,
        });
      }

      throw new Error('Send failed');
    },
    [
      activeAccount?.addressPVM,
      activeNetwork,
      captureEncrypted,
      getFilteredUtxos,
      getWallet,
      isLedgerWallet,
      provider,
      request,
    ]
  );

  const send = useCallback(
    async (sendState: SendState) => {
      if (!activeNetwork) {
        throw new Error(`Network Init Error: Wrong network`);
      }

      if (isPchainNetwork(activeNetwork)) {
        return await pchainSend(sendState);
      }

      throw new Error('Send on this network is not supported');
    },
    [activeNetwork, pchainSend]
  );

  return (
    <SendContext.Provider
      value={{
        getNetworkFee,
        validateStateAndCalculateFees,
        send,
      }}
    >
      {children}
    </SendContext.Provider>
  );
}

export function useSendContext() {
  return useContext(SendContext);
}
