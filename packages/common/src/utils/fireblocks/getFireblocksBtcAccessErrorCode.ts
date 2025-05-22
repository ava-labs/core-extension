import { BTC_ACCESS_ERROR_PREFIX } from '@core/types';

export function getFireblocksBtcAccessErrorCode(message: string) {
  const [, code] = message.split(BTC_ACCESS_ERROR_PREFIX);

  if (typeof code === 'undefined' || code === '') {
    return null;
  }

  return parseInt(code);
}
