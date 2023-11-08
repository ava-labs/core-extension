import {
  BTC_ACCESS_ERROR_PREFIX,
  FireblocksBtcAccessErrorCode,
} from '../models';
import getFireblocksBtcAccessErrorCode from './getFireblocksBtcAccessErrorCode';

describe('src/background/services/fireblocks/utils/getFireblocksBtcAccessErrorCode', () => {
  const buildError = (code: number) => `${BTC_ACCESS_ERROR_PREFIX}${code}`;

  it('returns null if error is not recognized as related to BTC-access', () => {
    expect(getFireblocksBtcAccessErrorCode('SomeDummyError')).toEqual(null);
    expect(getFireblocksBtcAccessErrorCode('Fireblocks:1')).toEqual(null);
  });

  it.each([
    [
      buildError(FireblocksBtcAccessErrorCode.BTCAddressNotFound),
      FireblocksBtcAccessErrorCode.BTCAddressNotFound,
    ],
    [
      buildError(FireblocksBtcAccessErrorCode.InvalidSecretKey),
      FireblocksBtcAccessErrorCode.InvalidSecretKey,
    ],
    [
      buildError(FireblocksBtcAccessErrorCode.SecretsNotConfigured),
      FireblocksBtcAccessErrorCode.SecretsNotConfigured,
    ],
    [
      buildError(FireblocksBtcAccessErrorCode.VaultAccountNotFound),
      FireblocksBtcAccessErrorCode.VaultAccountNotFound,
    ],
    [
      buildError(FireblocksBtcAccessErrorCode.WrongAccountType),
      FireblocksBtcAccessErrorCode.WrongAccountType,
    ],
  ])(`translates %s error message to code %i`, (message, expected) => {
    expect(getFireblocksBtcAccessErrorCode(message)).toEqual(expected);
  });
});
