import BN from 'bn.js';
import {
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalanceBTC,
  TokenWithBalanceEVM,
  TokenWithBalancePVM,
} from '../models';
import { isTokenWithBalancePVM } from './isTokenWithBalancePVM';

describe('src/background/services/balances/utils/isTokenWithBalancePVM.ts', () => {
  const tokenWithBalanceAVM: TokenWithBalanceAVM = {
    type: TokenType.NATIVE,
    name: 'Avalanche',
    symbol: 'AVAX',
    balance: new BN(1),
    decimals: 9,
    description: 'description',
    logoUri: 'logoUri',
    locked: 1,
    unlocked: 2,
    atomicMemoryUnlocked: 3,
    atomicMemoryLocked: 4,
  };

  const tokenWithBalancePVM: TokenWithBalancePVM = {
    type: TokenType.NATIVE,
    name: 'Avalanche',
    symbol: 'AVAX',
    balance: new BN(1),
    decimals: 9,
    description: 'description',
    logoUri: 'logoUri',
    lockedStaked: 1,
    lockedStakeable: 2,
    lockedPlatform: 3,
    atomicMemoryLocked: 4,
    atomicMemoryUnlocked: 5,
    unlockedUnstaked: 6,
    unlockedStaked: 7,
    pendingStaked: 8,
  };

  const tokenWithBalanceBTC: TokenWithBalanceBTC = {
    type: TokenType.NATIVE,
    name: 'Avalanche',
    symbol: 'AVAX',
    balance: new BN(1),
    decimals: 9,
    description: 'description',
    logoUri: 'logoUri',
    utxos: [],
  };

  const tokenWithBalanceEVM: TokenWithBalanceEVM = {
    type: TokenType.NATIVE,
    name: 'Avalanche',
    symbol: 'AVAX',
    balance: new BN(1),
    decimals: 9,
    description: 'description',
    logoUri: 'logoUri',
  };

  it('should return true when balance is TokenWithBalancePVM ', () => {
    const result = isTokenWithBalancePVM(tokenWithBalancePVM);
    expect(result).toEqual(true);
  });

  it('should return fa;se when balance is not TokenWithBalancePVM ', () => {
    const resultAVM = isTokenWithBalancePVM(tokenWithBalanceAVM);
    expect(resultAVM).toEqual(false);
    const resultBTC = isTokenWithBalancePVM(tokenWithBalanceBTC);
    expect(resultBTC).toEqual(false);
    const resultEVM = isTokenWithBalancePVM(tokenWithBalanceEVM);
    expect(resultEVM).toEqual(false);
  });
});
