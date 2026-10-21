import { LedgerDeviceInfo } from '@core/types';

export const getLedgerSentryTags = (
  deviceInfo: LedgerDeviceInfo | null,
): Record<string, string> =>
  Object.fromEntries(
    Object.entries({
      'ledger.model': deviceInfo?.deviceModel,
      'ledger.app': deviceInfo?.appName,
      'ledger.appVersion': deviceInfo?.appVersion,
      'ledger.firmware': deviceInfo?.firmwareVersion,
    }).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
