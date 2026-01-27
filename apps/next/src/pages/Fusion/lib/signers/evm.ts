import { TFunction } from 'react-i18next';
import { RpcMethod } from '@avalabs/vm-module-types';
import { EvmSigner } from '@avalabs/unified-asset-transfer';

import { assert, chainIdToCaip } from '@core/common';
import { RequestHandlerType, UnifiedBridgeError } from '@core/types';

export function getEVMSigner(
  request: RequestHandlerType,
  _t: TFunction,
): EvmSigner {
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
        console.error(err);
        throw err;
      }
    },
  };
}
