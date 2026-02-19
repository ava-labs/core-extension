import { hex, utf8 } from '@scure/base';
import { TFunction } from 'react-i18next';
import { RpcMethod } from '@avalabs/vm-module-types';
import { EvmSignerWithMessage } from '@avalabs/unified-asset-transfer';

import { assert, chainIdToCaip } from '@core/common';
import { RequestHandlerType, UnifiedBridgeError } from '@core/types';

export function getEVMSigner(
  request: RequestHandlerType,
  _t: TFunction,
): EvmSignerWithMessage {
  return {
    sign: async ({ from, data, to, value, chainId }) => {
      assert(to, UnifiedBridgeError.InvalidTxPayload);
      assert(from, UnifiedBridgeError.InvalidTxPayload);
      assert(data, UnifiedBridgeError.InvalidTxPayload);
      assert(chainId, UnifiedBridgeError.MissingChainId);
      try {
        const result = await request(
          {
            method: RpcMethod.ETH_SEND_TRANSACTION,
            params: [
              {
                from,
                to,
                data,
                value:
                  typeof value === 'bigint'
                    ? `0x${value.toString(16)}`
                    : undefined,
                chainId,
              },
            ],
          },
          {
            scope: chainIdToCaip(Number(chainId)),
          },
        );

        return result as `0x${string}`;
      } catch (err) {
        console.error(`[fusion::evmSigner.sign]`, err);
        throw err;
      }
    },

    signMessage: async (data: {
      message: string;
      address: `0x${string}`;
      chainId: number;
    }) => {
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
