import { ErrorCode as UnifiedAssetTransferErrorCode } from '@avalabs/unified-asset-transfer';
import { TFunction } from 'react-i18next';

export const getErrorMessage = (
  t: TFunction,
  errorCode: UnifiedAssetTransferErrorCode,
) => {
  switch (errorCode) {
    case UnifiedAssetTransferErrorCode.SERVICE_NOT_AVAILABLE:
      return t('Swap service not available');

    case UnifiedAssetTransferErrorCode.INITIALIZATION_FAILED:
      return t('Swap service initialization failed');

    case UnifiedAssetTransferErrorCode.INVALID_PARAMS:
      return t('Invalid transfer parameters');

    case UnifiedAssetTransferErrorCode.TIMEOUT:
      return t('The transaction timed out');

    case UnifiedAssetTransferErrorCode.TRANSACTION_REVERTED:
      return t('The transaction has been reverted');

    case UnifiedAssetTransferErrorCode.NOTARIZATION_FAILED:
      return t(
        'Notarization failed. Please reach out to the support team to claim your funds.',
      );

    default:
      return t('An unknown error occurred (code: {{errorCode}}).', {
        errorCode,
      });
  }
};
