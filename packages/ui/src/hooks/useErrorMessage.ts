import { errorCodes } from 'eth-rpc-errors';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { isWrappedError } from '@core/common';
import {
  CommonError,
  FireblocksErrorCode,
  KeystoreError,
  RpcErrorCode,
  SecretsError,
  SeedphraseImportError,
  SwapErrorCode,
  UnifiedBridgeError,
} from '@core/types';

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
        [UnifiedBridgeError.MissingChainId]: {
          title: t('Missing chain ID'),
        },
      }),
      [t],
    );

  const swapErrors: Record<SwapErrorCode, ErrorTranslation> = useMemo(
    () => ({
      [SwapErrorCode.ClientNotInitialized]: {
        title: t('Swap client is not initialized'),
        hint: t('Please try switching to a different network.'),
      },
      [SwapErrorCode.ApiError]: {
        title: t('There was an error contacting our pricing provider.'),
        hint: t('Please try again later.'),
      },
      [SwapErrorCode.CannotBuildTx]: {
        title: t('Pricing provider did not respond with a valid transaction.'),
        hint: t('Please try again later.'),
      },
      [SwapErrorCode.CannotFetchAllowance]: {
        title: t('There was an error fetching your spend approvals.'),
        hint: t('Try swapping a different token or try again later.'),
      },
      [SwapErrorCode.MissingContractMethod]: {
        title: t('This token contract is missing a required method.'),
        hint: t('Try swapping a different token.'),
      },
      [SwapErrorCode.MissingParams]: {
        title: t('Some of the required parameters are missing.'),
        hint: t(
          'Our team was made aware of this issue. Feel free to contact us for further information.',
        ),
      },
      [SwapErrorCode.UnexpectedApiResponse]: {
        title: t('Unexpected response from our pricing provider.'),
        hint: t('Please try again later.'),
      },
      [SwapErrorCode.UnknownSpender]: {
        title: t('Unexpected response from our pricing provider.'),
        hint: t('Please try again later.'),
      },
      [SwapErrorCode.InvalidParams]: {
        title: t('Some of the required parameters are invalid.'),
        hint: t(
          'Our team was made aware of this issue. Feel free to contact us for further information.',
        ),
      },
      [SwapErrorCode.FeatureDisabled]: {
        title: t('Feature is disabled'),
        hint: t('Please try again later.'),
      },
      [SwapErrorCode.TransactionError]: {
        title: t('This transaction would likely fail'),
        hint: t('Please try again later or choose a different token pair.'),
      },
      [SwapErrorCode.IncorrectTokenAddress]: {
        title: t('Incorrect token address'),
        hint: t('Please try again later or choose a different token pair.'),
      },
      [SwapErrorCode.WrongQuoteProvider]: {
        title: t('Wrong quote provider'),
      },
      [SwapErrorCode.CannotFetchSpender]: {
        title: t('There was an error fetching your spend approvals.'),
        hint: t('Try swapping a different token or try again later.'),
      },
      [SwapErrorCode.ApprovalTxFailed]: {
        title: t('Approval transaction failed'),
      },
      [SwapErrorCode.InvalidSlippageTolerance]: {
        title: t('Invalid slippage tolerance'),
      },
      [SwapErrorCode.InsufficientBalance]: {
        title: t('Insufficient balance'),
      },
      [SwapErrorCode.TransactionRevertedDueToSlippage]: {
        title: t('Transaction reverted due to slippage'),
        hint: t('Please try again with a different slippage tolerance.'),
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
      [CommonError.UnsupportedTokenType]: {
        title: t('Unsupported token type'),
        hint: t('Sending this type of token is not supported by Core'),
      },
      [CommonError.NetworkError]: {
        title: t('Network error'),
        hint: t('Please check your connection and try again.'),
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
      [CommonError.ModuleManagerNotSet]: {
        title: t('Internal error occurred.'), // Do not leak implementation details to the UI
      },
      [CommonError.MigrationFailed]: {
        title: t('Storage update failed'),
      },
      [CommonError.UnableToSign]: {
        title: t('Unable to sign or broadcast transaction'),
      },
      [CommonError.UnableToEstimateGas]: {
        title: t('Unable to estimate gas'),
      },
      [CommonError.MismatchingProvider]: {
        title: t('Mismatching provider'),
        hint: t(
          'Core has entered an unexpected state. Please restart the browser if the issue persists.',
        ),
      },
      [CommonError.InvalidAmount]: {
        title: t('Invalid amount'),
        hint: t('Please enter a valid amount.'),
      },
    }),
    [t],
  );

  const secretErrors: Record<SecretsError, ErrorTranslation> = useMemo(
    () => ({
      [SecretsError.MissingExtendedPublicKey]: {
        title: t('Extended public key not found'),
      },
      [SecretsError.NoAccountIndex]: {
        title: t('No account index was provided'),
      },
      [SecretsError.PublicKeyNotFound]: {
        title: t('Public key not found'),
      },
      [SecretsError.SecretsNotFound]: {
        title: t('Wallet secrets not found for the requested ID'),
      },
      [SecretsError.WalletAlreadyExists]: {
        title: t('This wallet is already imported'),
      },
      [SecretsError.DerivationPathMissing]: {
        title: t('Attempted to use an unknown derivation path'),
      },
      [SecretsError.DerivationPathTooShort]: {
        title: t('Error while deriving address'),
        hint: t('Requested derivation path is too short'),
      },
      [SecretsError.UnsupportedSecretType]: {
        title: t('Error while deriving address'),
        hint: t('Unsupporetd secret type'),
      },
      [SecretsError.UnsupportedCurve]: {
        title: t('Error while deriving address'),
        hint: t('Unsupported elliptic curve'),
      },
      [SecretsError.UnknownDerivationPathFormat]: {
        title: t('Error while deriving address'),
        hint: t('Unsupported derivation path format'),
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
      ...secretErrors,
      ...swapErrors,
    }),
    [
      fireblocksErrors,
      unifiedBridgeErrors,
      commonErrors,
      standardRpcErrors,
      keystoreErrors,
      seedphraseImportError,
      rpcErrors,
      secretErrors,
      swapErrors,
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
