import { BtcSigner } from '@avalabs/bridge-unified';
import { RpcMethod } from '@avalabs/vm-module-types';
import { RequestHandlerType } from '@core/types';
import { TFunction } from 'react-i18next';

export function getBtcSigner(
  request: RequestHandlerType,
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
            context: {
              customApprovalScreenTitle: t('Confirm Bridge'),
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
