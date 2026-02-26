import { TFunction } from 'react-i18next';
import { RpcMethod } from '@avalabs/vm-module-types';
import { SolanaSigner } from '@avalabs/unified-asset-transfer';
import { SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';

import { assert } from '@core/common';
import { RequestHandlerType, UnifiedBridgeError } from '@core/types';

export function getSVMSigner(
  request: RequestHandlerType,
  scope: SolanaCaip2ChainId,
  _t: TFunction,
): SolanaSigner {
  return {
    signAndSend: async (
      { serializedTx, sendOptions, account },
      { currentSignature, requiredSignatures },
    ) => {
      assert(serializedTx, UnifiedBridgeError.InvalidTxPayload);
      assert(account, UnifiedBridgeError.InvalidTxPayload);

      try {
        const result = await request(
          {
            method: RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,
            params: [
              {
                account,
                serializedTx,
                sendOptions,
              },
            ],
          },
          {
            scope,
            context: {
              isIntermediateTransaction: currentSignature < requiredSignatures,
            },
          },
        );

        return result as `0x${string}`;
      } catch (err) {
        console.error(`[fusion::svmSigner.signAndSend]`, err);
        throw err;
      }
    },
  };
}
