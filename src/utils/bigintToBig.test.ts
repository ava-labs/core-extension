import Big from 'big.js';
import { bigintToBig } from './bigintToBig';

describe('utils/bigintToBig', () => {
  it('should return the Big value', () => {
    expect(bigintToBig(2000000000000n, 9)).toEqual(new Big(2000));
    expect(bigintToBig(2000000000000n, 0)).toEqual(new Big(2000000000000));
    expect(bigintToBig(2000000000000n, -1)).toEqual(new Big(20000000000000));
    expect(bigintToBig(2000000000000n, 16)).toEqual(new Big(0.0002));
    expect(bigintToBig(0n, 9)).toEqual(new Big(0));
  });
});
