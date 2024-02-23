import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { errorCodes } from 'eth-rpc-errors';

import { FireblocksErrorCode } from '@src/background/services/fireblocks/models';
import { CommonError, isWrappedError } from '@src/utils/errors';
import { UnifiedBridgeError } from '@src/background/services/unifiedBridge/models';
import { SeedphraseImportError } from '@src/background/services/wallet/handlers/models';

type ErrorTranslation = {
  title: string;
  hint?: string;
};

export const useErrorMessage = () => {
  const { t } = useTranslation();

  const fireblocksErrors: Record<FireblocksErrorCode, ErrorTranslation> =
    useMemo(() => {
      const fireblocksHint = t(
        'Please refer to Active Transfers list in your Fireblocks Console for a detailed explanation.'
      );

      return {
        [FireblocksErrorCode.Blocked]: {
          title: t('Transaction has been blocked'),
          hint: fireblocksHint,
        },
        [FireblocksErrorCode.Failed]: {
          title: t('Transaction has failed'),
          hint: fireblocksHint,
        },
        [FireblocksErrorCode.Rejected]: {
          title: t('Transaction has been rejected'),
          hint: fireblocksHint,
        },
        [FireblocksErrorCode.Cancelled]: {
          title: t('Transaction has been cancelled'),
          hint: fireblocksHint,
        },
        [FireblocksErrorCode.Timeout]: {
          title: t('Transaction timed out'),
          hint: fireblocksHint,
        },
        [FireblocksErrorCode.Unknown]: {
          title: t('Unknown transaction error'),
          hint: t('Please try again later or contact support.'),
        },
      };
    }, [t]);

  // These messages will serve as generic fallbacks in case data.reason
  // is not specified in the returned error.
  const standardRpcErrors: Record<number, ErrorTranslation> = useMemo(
    () => ({
      [errorCodes.rpc.internal]: {
        title: t('Internal error'),
      },
      [errorCodes.rpc.transactionRejected]: {
        title: t('Transaction rejected'),
      },
      [errorCodes.rpc.invalidRequest]: {
        title: t('Invalid request'),
      },
      [errorCodes.rpc.invalidParams]: {
        title: t('Invalid params'),
      },
      [errorCodes.rpc.limitExceeded]: {
        title: t('Limit exceeded'),
      },
      [errorCodes.rpc.resourceUnavailable]: {
        title: t('Resource unavailable'),
      },
      [errorCodes.provider.disconnected]: {
        title: t('Disconnected'),
      },
      [errorCodes.provider.unauthorized]: {
        title: t('Unauthorized'),
      },
      [errorCodes.provider.userRejectedRequest]: {
        title: t('User rejected the request'),
      },
    }),
    [t]
  );

  const unifiedBridgeErrors: Record<UnifiedBridgeError, ErrorTranslation> =
    useMemo(
      () => ({
        [UnifiedBridgeError.AmountLessThanFee]: {
          title: t('Amount is too low'),
          hint: t('The amount cannot be lower than the bridging fee'),
        },
        [UnifiedBridgeError.InvalidFee]: {
          title: t('The bridging fee is unknown'),
        },
        [UnifiedBridgeError.UnknownAsset]: {
          title: t('This asset cannot be bridged'),
        },
        [UnifiedBridgeError.UnsupportedNetwork]: {
          title: t('Unsupported network'),
        },
      }),
      [t]
    );

  const commonErrors: Record<CommonError, ErrorTranslation> = useMemo(
    () => ({
      [CommonError.Unknown]: {
        title: t('Unknown error'),
      },
      [CommonError.UserRejected]: {
        title: t('User declined the transaction'),
      },
      [CommonError.NetworkError]: {
        title: t('Network error'),
        hint: t('Please try again'),
      },
      [CommonError.NoActiveAccount]: {
        title: t('No account is active'),
        hint: t('Please try again'),
      },
      [CommonError.NoActiveNetwork]: {
        title: t('No active network'),
        hint: t('Please try again'),
      },
      [CommonError.UnknownNetwork]: {
        title: t('Unknown network'),
      },
      [CommonError.UnknownNetworkFee]: {
        title: t('Unknown network fee'),
      },
    }),
    [t]
  );

  const seedphraseImportError: Record<SeedphraseImportError, ErrorTranslation> =
    useMemo(
      () => ({
        [SeedphraseImportError.ExistingSeedphrase]: {
          title: t('This seedphrase is already imported.'),
        },
      }),
      [t]
    );

  const messages = useMemo(
    () => ({
      ...fireblocksErrors,
      ...unifiedBridgeErrors,
      ...commonErrors,
      ...standardRpcErrors,
      ...seedphraseImportError,
    }),
    [
      fireblocksErrors,
      commonErrors,
      standardRpcErrors,
      unifiedBridgeErrors,
      seedphraseImportError,
    ]
  );

  return useCallback(
    (error: unknown): ErrorTranslation => {
      if (typeof error === 'string') {
        return { title: error };
      }

      let message: ErrorTranslation = messages[CommonError.Unknown];

      if (isWrappedError(error)) {
        message = messages[error.data.reason] ?? messages[CommonError.Unknown];
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof error.code === 'number'
      ) {
        message = messages[error.code];
      }

      return message ?? messages[CommonError.Unknown];
    },
    [messages]
  );
};
