import { TFunction } from 'react-i18next';
import { RpcMethod } from '@avalabs/vm-module-types';
import { BtcSigner } from '@avalabs/unified-asset-transfer';
import { BitcoinCaip2ChainId } from '@avalabs/core-chains-sdk';

import { RequestHandlerType } from '@core/types';

import { buildRequestContext } from './lib/buildRequestContext';

export function getBtcSigner(
  request: RequestHandlerType,
  scope: BitcoinCaip2ChainId,
  _t: TFunction,
): BtcSigner {
  return {
    sign: async ({ inputs, outputs }, _, stepDetails) => {
      try {
        const result = await request(
          {
            method: RpcMethod.BITCOIN_SIGN_TRANSACTION,
            params: {
              inputs,
              outputs,
            },
          },
          {
            scope,
            context: buildRequestContext(stepDetails),
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
