import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { errorCodes } from 'eth-rpc-errors';

import { FireblocksErrorCode } from '@src/background/services/fireblocks/models';
import { CommonError, isWrappedError } from '@src/utils/errors';

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
    }),
    [t]
  );

  const messages = useMemo(
    () => ({
      ...fireblocksErrors,
      ...commonErrors,
      ...standardRpcErrors,
    }),
    [fireblocksErrors, commonErrors, standardRpcErrors]
  );

  return useCallback(
    (error: unknown): ErrorTranslation => {
      if (typeof error === 'string') {
        return { title: error };
      }

      let message: ErrorTranslation = messages[CommonError.Unknown];

      if (isWrappedError(error)) {
        message = messages[error.data.reason];
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
