import { useCallback, useMemo } from 'react';
import { utils } from '@avalabs/avalanchejs';
import { AvalancheCaip2ChainId, ChainId } from '@avalabs/core-chains-sdk';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { AvalancheBlockchainAlias } from '@avalabs/fusion-sdk';
import { RpcMethod } from '@avalabs/vm-module-types';
import {
  AvalancheFunctions,
  getMaxUtxoSet,
  stripAddressPrefix,
} from '@core/common';
import { isAvmCapableAccount, isPvmCapableAccount } from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useNetworkContext,
  useSettingsContext,
  useWalletContext,
} from '@core/ui';

import { getAvalancheProvider } from '@/lib/getAvalancheProvider';

import { useGetXPAddresses } from '@/hooks/useGetXPAddresses';

const getNetworkCaipIdForChainAlias = (
  chainAlias: AvalancheBlockchainAlias,
  isTestnet: boolean,
) => {
  if (chainAlias === 'C') {
    return isTestnet
      ? AvalancheCaip2ChainId.C_TESTNET
      : AvalancheCaip2ChainId.C;
  }

  if (chainAlias === 'P') {
    return isTestnet
      ? AvalancheCaip2ChainId.P_TESTNET
      : AvalancheCaip2ChainId.P;
  }

  return isTestnet ? AvalancheCaip2ChainId.X_TESTNET : AvalancheCaip2ChainId.X;
};

const unavailableAvalancheFunctions: AvalancheFunctions = {
  avalancheSendTx: () => {
    throw new Error('Avalanche CCT is not available for the active account.');
  },
  getAtomicUtxos: () => {
    throw new Error('Avalanche CCT is not available for the active account.');
  },
  getCoreEthAddress: () => {
    throw new Error('Avalanche CCT is not available for the active account.');
  },
  getUtxos: () => {
    throw new Error('Avalanche CCT is not available for the active account.');
  },
  getWalletAddressesForChainAlias: () => {
    throw new Error('Avalanche CCT is not available for the active account.');
  },
  getWalletChangeAddressForChainAlias: () => {
    throw new Error('Avalanche CCT is not available for the active account.');
  },
};

export const useAvalancheFunctions = (): AvalancheFunctions => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const { request } = useConnectionContext();
  const { filterSmallUtxos } = useSettingsContext();
  const { isLedgerWallet } = useWalletContext();
  const { getNetwork, network } = useNetworkContext();
  const getXPAddresses = useGetXPAddresses();

  const isTestnet = Boolean(network?.isTestnet);

  const getNetworkForChainAlias = useCallback(
    (chainAlias: AvalancheBlockchainAlias) => {
      if (chainAlias === 'P') {
        return getNetwork(
          isTestnet ? ChainId.AVALANCHE_TEST_P : ChainId.AVALANCHE_P,
        );
      }

      if (chainAlias === 'X') {
        return getNetwork(
          isTestnet ? ChainId.AVALANCHE_TEST_X : ChainId.AVALANCHE_X,
        );
      }

      return getNetwork(
        isTestnet ? AvalancheCaip2ChainId.C_TESTNET : AvalancheCaip2ChainId.C,
      );
    },
    [getNetwork, isTestnet],
  );

  const getWalletAddressesForChainAlias = useCallback<
    AvalancheFunctions['getWalletAddressesForChainAlias']
  >(
    async (chainAlias) => {
      if (!active) {
        return [];
      }

      if (chainAlias === 'C') {
        return active.addressCoreEth ? [active.addressCoreEth] : [];
      }

      const baseAddress =
        chainAlias === 'P' ? active.addressPVM : active.addressAVM;
      const vm = chainAlias === 'P' ? 'PVM' : 'AVM';
      const addresses = await getXPAddresses(vm)();

      return [
        baseAddress,
        ...addresses.externalAddresses.map(({ address }) => address),
        ...addresses.internalAddresses.map(({ address }) => address),
      ].filter((address): address is string => Boolean(address));
    },
    [active, getXPAddresses],
  );

  const getWalletChangeAddressForChainAlias = useCallback<
    AvalancheFunctions['getWalletChangeAddressForChainAlias']
  >(
    (chainAlias) => {
      const address =
        chainAlias === 'C'
          ? active?.addressCoreEth
          : chainAlias === 'P'
            ? active?.addressPVM
            : active?.addressAVM;

      if (!address) {
        throw new Error(`Missing Avalanche ${chainAlias}-Chain address.`);
      }

      return address;
    },
    [active],
  );

  const getWallet = useCallback(async () => {
    if (!active?.addressC || !active.addressCoreEth) {
      throw new Error('Active account does not support Avalanche CCT.');
    }

    const xpAddresses = [
      ...(await getWalletAddressesForChainAlias('P')),
      ...(await getWalletAddressesForChainAlias('X')),
    ]
      .map(stripAddressPrefix)
      .filter(
        (address, index, addresses) => addresses.indexOf(address) === index,
      );

    if (xpAddresses.length === 0) {
      throw new Error('Active account does not have Avalanche XP addresses.');
    }

    const providerNetwork = getNetworkForChainAlias('P');

    if (!providerNetwork) {
      throw new Error('Avalanche P-Chain network is not available.');
    }

    const provider = getAvalancheProvider(providerNetwork);

    return new Avalanche.AddressWallet(
      active.addressC,
      stripAddressPrefix(active.addressCoreEth),
      xpAddresses,
      stripAddressPrefix(
        active.addressPVM ?? active.addressAVM ?? xpAddresses[0]!,
      ),
      provider,
    );
  }, [active, getNetworkForChainAlias, getWalletAddressesForChainAlias]);

  return useMemo(() => {
    if (
      !active?.addressC ||
      !active.addressCoreEth ||
      (!isPvmCapableAccount(active) && !isAvmCapableAccount(active))
    ) {
      return unavailableAvalancheFunctions;
    }

    return {
      avalancheSendTx: async ({ chainAlias, unsignedTx }) => {
        const manager = utils.getManagerForVM(unsignedTx.getVM());
        const [codec] = manager.getCodecFromBuffer(unsignedTx.toBytes());
        const utxos = 'utxos' in unsignedTx ? unsignedTx.utxos : [];

        const utxoAddresses = new Set(
          utxos.flatMap((utxo) => utxo.getOutputOwners().addrs.map(String)),
        );
        const vm = chainAlias === 'P' ? 'PVM' : 'AVM';
        const addresses =
          chainAlias === 'C'
            ? { externalAddresses: [], internalAddresses: [] }
            : await getXPAddresses(vm)();
        const getOwnedIndices = (
          ownedAddresses: typeof addresses.externalAddresses,
        ) =>
          ownedAddresses.reduce((indices, address) => {
            if (utxoAddresses.has(stripAddressPrefix(address.address))) {
              indices.push(address.index);
            }

            return indices;
          }, [] as number[]);

        return request(
          {
            method: RpcMethod.AVALANCHE_SEND_TRANSACTION,
            params: {
              transactionHex: Buffer.from(unsignedTx.toBytes()).toString('hex'),
              chainAlias,
              utxos: utxos.map((utxo) =>
                utils.bufferToHex(utxo.toBytes(codec)),
              ),
              externalIndices: getOwnedIndices(addresses.externalAddresses),
              internalIndices: getOwnedIndices(addresses.internalAddresses),
            },
          },
          {
            scope: getNetworkCaipIdForChainAlias(chainAlias, isTestnet),
          },
        ) as Promise<string>;
      },
      getAtomicUtxos: async (destinationChain, sourceChain) => {
        const wallet = await getWallet();

        return wallet.getAtomicUTXOs(destinationChain, sourceChain);
      },
      getCoreEthAddress: (evmAddress) => {
        if (evmAddress.toLowerCase() !== active.addressC.toLowerCase()) {
          throw new Error('Unknown Avalanche C-Chain address.');
        }

        return active.addressCoreEth;
      },
      getUtxos: async (chainAlias) => {
        const wallet = await getWallet();
        const networkForChain = getNetworkForChainAlias(chainAlias);

        if (!networkForChain) {
          throw new Error(`Unknown Avalanche ${chainAlias}-Chain network.`);
        }

        const provider = getAvalancheProvider(networkForChain);
        const feeState =
          chainAlias === 'P'
            ? await provider.getApiP().getFeeState()
            : undefined;

        const { utxos } = await getMaxUtxoSet({
          isLedgerWallet,
          provider,
          wallet,
          network: networkForChain,
          filterSmallUtxos,
          feeState,
        });

        return utxos;
      },
      getWalletAddressesForChainAlias,
      getWalletChangeAddressForChainAlias,
    };
  }, [
    active,
    filterSmallUtxos,
    getNetworkForChainAlias,
    getWallet,
    getWalletAddressesForChainAlias,
    getWalletChangeAddressForChainAlias,
    getXPAddresses,
    isLedgerWallet,
    isTestnet,
    request,
  ]);
};
