import { ErrorCode as UnifiedBridgeErrorCode } from '@avalabs/bridge-unified';
import { memoize } from 'lodash';
import { TFunction } from 'react-i18next';

export const getErrorMessage = memoize(
  (t: TFunction) => (errorCode: UnifiedBridgeErrorCode) => {
    switch (errorCode) {
      case UnifiedBridgeErrorCode.BRIDGE_NOT_AVAILABLE:
        return t('Bridge not available');

      case UnifiedBridgeErrorCode.INITIALIZATION_FAILED:
        return t('Bridge initialization failed');

      case UnifiedBridgeErrorCode.INVALID_PARAMS:
        return t('Invalid transfer parameters');

      case UnifiedBridgeErrorCode.TIMEOUT:
        return t('The transaction timed out');

      case UnifiedBridgeErrorCode.TRANSACTION_REVERTED:
        return t('The transaction has been reverted');
    }
  },
);
