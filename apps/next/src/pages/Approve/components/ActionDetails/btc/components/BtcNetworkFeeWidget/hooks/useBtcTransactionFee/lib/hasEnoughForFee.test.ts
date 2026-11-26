import { NativeTokenBalance } from '@core/types';

import { BtcTxSigningData } from '../types';
import { hasEnoughForFee } from './hasEnoughForFee';

const data = {
  data: { feeRate: 10, fee: 1500, amount: 10_000 },
} as unknown as BtcTxSigningData;

const token = (balance: bigint) => ({ balance }) as NativeTokenBalance;

describe('hasEnoughForFee (BTC)', () => {
  it('requires amount plus fee', () => {
    expect(hasEnoughForFee(data, token(11_500n))).toBe(true);
    expect(hasEnoughForFee(data, token(11_499n))).toBe(false);
  });

  it('is false without data or token', () => {
    expect(hasEnoughForFee(undefined, token(1n))).toBe(false);
    expect(hasEnoughForFee(data, undefined)).toBe(false);
  });
});
