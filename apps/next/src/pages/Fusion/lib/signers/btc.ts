import { TFunction } from 'react-i18next';
import { RpcMethod } from '@avalabs/vm-module-types';
import { BtcSigner } from '@avalabs/unified-asset-transfer';
import { BitcoinCaip2ChainId } from '@avalabs/core-chains-sdk';

import { RequestHandlerType } from '@core/types';

export function getBtcSigner(
  request: RequestHandlerType,
  scope: BitcoinCaip2ChainId,
  t: TFunction,
): BtcSigner {
  return {
    sign: async (
      { inputs, outputs },
      _,
      { requiredSignatures, currentSignature },
    ) => {
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
            context: {
              customApprovalScreenTitle: t('Confirm Bridge'),
              // Mark as bridge to skip toast/confetti (bridge has its own status tracking)
              isBridge: true,
              alert:
                requiredSignatures > currentSignature
                  ? {
                      type: 'info',
                      title: t('This operation requires {{total}} approvals.', {
                        total: requiredSignatures,
                      }),
                      notice: t(
                        'You will be prompted {{remaining}} more time(s).',
                        {
                          remaining: requiredSignatures - currentSignature,
                        },
                      ),
                    }
                  : undefined,
            },
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
