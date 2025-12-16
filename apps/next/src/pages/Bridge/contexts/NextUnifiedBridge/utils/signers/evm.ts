import { EvmSigner } from '@avalabs/bridge-unified';
import { RpcMethod } from '@avalabs/vm-module-types';
import { assert, chainIdToCaip } from '@core/common';
import { RequestHandlerType, UnifiedBridgeError } from '@core/types';
import { TFunction } from 'react-i18next';

export function getEVMSigner(
  request: RequestHandlerType,
  t: TFunction,
): EvmSigner {
  return {
    sign: async (
      { from, data, to, value, chainId },
      _,
      { currentSignature, requiredSignatures },
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
