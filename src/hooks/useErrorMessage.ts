import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { errorCodes } from 'eth-rpc-errors';

import { FireblocksErrorCode } from '@src/background/services/fireblocks/models';
import { CommonError, RpcErrorCode, isWrappedError } from '@src/utils/errors';
import { UnifiedBridgeError } from '@src/background/services/unifiedBridge/models';
import { KeystoreError } from '@src/utils/keystore/models';
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
        'Please refer to Active Transfers list in your Fireblocks Console for a detailed explanation.',
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
    [t],
  );

  const unifiedBridgeErrors: Record<UnifiedBridgeError, ErrorTranslation> =
    useMemo(
      () => ({
        [UnifiedBridgeError.AmountLessThanFee]: {
          title: t('Amount is too low'),
          hint: t('The amount cannot be lower than the bridging fee'),
        },
        [UnifiedBridgeError.InvalidTxPayload]: {
          title: t('Invalid transaction data'),
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
        [UnifiedBridgeError.NonBitcoinAccount]: {
          title: t('Unsupported account'),
          hint: t(`The active account does not support Bitcoin.`),
        },
      }),
      [t],
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
      [CommonError.RequestTimeout]: {
        title: t('Request timed out'),
        hint: t('This is taking longer than expected. Please try again later.'),
      },
    }),
    [t],
  );

  const rpcErrors: Record<RpcErrorCode, ErrorTranslation> = useMemo(
    () => ({
      [RpcErrorCode.InsufficientFunds]: {
        title: t('Insufficient funds'),
        hint: t('You do not have enough funds to cover the network fees.'),
      },
    }),
    [t],
  );
  const keystoreErrors: Record<KeystoreError, ErrorTranslation> = useMemo(
    () => ({
      [KeystoreError.InvalidPassword]: {
        title: t('Invalid password. Please try again.'),
      },
      [KeystoreError.InvalidVersion]: {
        title: t('Unsupported Version'),
        hint: t(
          'Only keystore files exported from the Avalanche Wallet are supported.',
        ),
      },
      [KeystoreError.NoNewWallets]: {
        title: t('No New Wallets Found'),
        hint: t('All keys contained in this file are already imported.'),
      },
      [KeystoreError.Unknown]: {
        title: t('File Upload Failed'),
        hint: t('Please contact our support team to resolve this issue.'),
      },
    }),
    [t],
  );

  const seedphraseImportError: Record<SeedphraseImportError, ErrorTranslation> =
    useMemo(
      () => ({
        [SeedphraseImportError.ExistingSeedphrase]: {
          title: t('This recovery phrase is already imported.'),
        },
      }),
      [t],
    );

  const messages = useMemo(
    () => ({
      ...fireblocksErrors,
      ...unifiedBridgeErrors,
      ...commonErrors,
      ...standardRpcErrors,
      ...keystoreErrors,
      ...seedphraseImportError,
      ...rpcErrors,
    }),
    [
      fireblocksErrors,
      unifiedBridgeErrors,
      commonErrors,
      standardRpcErrors,
      keystoreErrors,
      seedphraseImportError,
      rpcErrors,
    ],
  );

  return useCallback(
    (error: unknown): ErrorTranslation => {
      if (typeof error === 'string') {
        return messages[error] ?? { title: error };
      }

      let message: ErrorTranslation = messages[CommonError.Unknown];

      if (isWrappedError(error)) {
        message = messages[error.data.reason] ?? messages[CommonError.Unknown];
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (typeof error.code === 'number' || typeof error.code === 'string')
      ) {
        message = messages[error.code];
      }

      return message ?? messages[CommonError.Unknown];
    },
    [messages],
  );
};
