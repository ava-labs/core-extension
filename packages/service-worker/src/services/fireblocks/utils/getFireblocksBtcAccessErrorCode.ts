import { BTC_ACCESS_ERROR_PREFIX } from '../models';

export default function getFireblocksBtcAccessErrorCode(message: string) {
  const [, code] = message.split(BTC_ACCESS_ERROR_PREFIX);

  if (typeof code === 'undefined' || code === '') {
    return null;
  }

  return parseInt(code);
}
