import { hex, utf8 } from '@scure/base';
import { TFunction } from 'react-i18next';
import { RpcMethod } from '@avalabs/vm-module-types';
import {
  EvmSignerWithMessage,
  EvmTransactionRequest,
} from '@avalabs/fusion-sdk';

import {
  FeatureGates,
  RequestHandlerType,
  SettingsState,
  UnifiedBridgeError,
} from '@core/types';
import { assert, chainIdToCaip } from '@core/common';

import {
  normalizeTransaction,
  normalizeTransactionsBatch,
} from './lib/evmNormalization';
import { buildRequestContext } from './lib/buildRequestContext';

const getChainIdForBatch = (transactions: readonly EvmTransactionRequest[]) => {
  const chainIds = new Set(transactions.map((tx) => tx.chainId));
  assert(chainIds.size === 1, UnifiedBridgeError.MultipleChainIdsInBatch);

  const chainId = chainIds.values().next().value;
  assert(chainId, UnifiedBridgeError.MissingChainId);

  return chainId;
};

export function getEVMSigner(
  request: RequestHandlerType,
  _t: TFunction,
  isFlagEnabled: (feature: FeatureGates) => boolean,
  isAutoSignSupported: boolean,
  {
    maxBuy,
    isQuickSwapsEnabled,
  }: Pick<SettingsState, 'maxBuy' | 'isQuickSwapsEnabled'>,
): EvmSignerWithMessage {
  return {
    signBatch: async (transactions, _, stepDetails) => {
      try {
        const batchChainId = getChainIdForBatch(transactions);
        const result = await request<RpcMethod.ETH_SEND_TRANSACTION_BATCH>(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION_BATCH,
            params: {
              transactions: normalizeTransactionsBatch(transactions),
              options: {
                skipIntermediateTxs: true,
              },
            },
          },
          {
            scope: chainIdToCaip(Number(batchChainId)),
            context: buildRequestContext(stepDetails, {
              maxBuy,
              isBatch: true,
              isSwapFeesEnabled: isFlagEnabled(FeatureGates.SWAP_FEES),
              isQuickSwapsEnabled:
                isQuickSwapsEnabled && isFlagEnabled(FeatureGates.QUICK_SWAPS),
              isAutoSignSupported,
            }),
          },
        );

        return result;
      } catch (err) {
        console.error(`[fusion::evmSigner.signBatch]`, err);
        throw err;
      }
    },
    sign: async (
      { from, data, to, value, chainId, maxFeePerGas, maxPriorityFeePerGas },
      _,
      stepDetails,
    ) => {
      assert(to, UnifiedBridgeError.InvalidTxPayload);
      assert(from, UnifiedBridgeError.InvalidTxPayload);
      assert(data, UnifiedBridgeError.InvalidTxPayload);
      assert(chainId, UnifiedBridgeError.MissingChainId);
      try {
        const result = await request(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [
              normalizeTransaction({
                from,
                to,
                data,
                value,
                chainId,
                maxFeePerGas,
                maxPriorityFeePerGas,
              }),
            ],
          },
          {
            scope: chainIdToCaip(Number(chainId)),
            context: buildRequestContext(stepDetails, {
              maxBuy,
              isBatch: false,
              isSwapFeesEnabled: isFlagEnabled(FeatureGates.SWAP_FEES),
              isQuickSwapsEnabled:
                isQuickSwapsEnabled && isFlagEnabled(FeatureGates.QUICK_SWAPS),
              isAutoSignSupported,
            }),
          },
        );

        return result as `0x${string}`;
      } catch (err) {
        console.error(`[fusion::evmSigner.sign]`, err);
        throw err;
      }
    },

    signMessage: async (
      data: {
        message: string;
        address: `0x${string}`;
        chainId: number;
      },
      _,
      stepDetails,
    ) => {
      const { message, address, chainId } = data;

      assert(message, UnifiedBridgeError.InvalidTxPayload);
      assert(address, UnifiedBridgeError.InvalidTxPayload);

      try {
        const result = await request(
          {
            method: RpcMethod.PERSONAL_SIGN,
            params: [`0x${hex.encode(utf8.decode(message))}`, address],
          },
          {
            scope: `eip155:${chainId}`,
            context: buildRequestContext(stepDetails),
          },
        );

        return result as `0x${string}`;
      } catch (err) {
        console.error(`[fusion::evmSigner.signMessage]`, err);
        throw err;
      }
    },
  };
}
