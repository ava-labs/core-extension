import { NativeTokenBalance } from '@core/types';

import { EvmTxSigningData } from '../types';
import { hasEnoughForFee } from './hasEnoughForFee';

const makeData = (value?: string) =>
  ({
    data: {
      maxFeePerGas: '0x2',
      gasLimit: '0x5208',
      value,
    },
  }) as unknown as EvmTxSigningData;

const GAS_FEE = 2n * 21_000n;

const token = (balance: bigint) => ({ balance }) as NativeTokenBalance;

describe('hasEnoughForFee (EVM)', () => {
  it('is false without data or token', () => {
    expect(hasEnoughForFee(undefined, token(1n))).toBe(false);
    expect(hasEnoughForFee(makeData(), undefined)).toBe(false);
  });

  it('checks gas only when there is no native value', () => {
    expect(hasEnoughForFee(makeData(), token(GAS_FEE))).toBe(true);
    expect(hasEnoughForFee(makeData(), token(GAS_FEE - 1n))).toBe(false);
  });

  it('requires value plus gas', () => {
    const data = makeData('0x3e8');

    expect(hasEnoughForFee(data, token(GAS_FEE + 1000n))).toBe(true);
    expect(hasEnoughForFee(data, token(GAS_FEE + 999n))).toBe(false);
  });
});
