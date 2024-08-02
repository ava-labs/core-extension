import BN from 'bn.js';
import { isTokenWithBalanceAVM } from './isTokenWithBalanceAVM';
import {
  TokenType,
  TokenWithBalanceAVM,
  TokenWithBalanceEVM,
  TokenWithBalancePVM,
} from '../models';
import {
  TokenWithBalanceBTC,
  TokenType as VMModulesTokenType,
} from '@avalabs/vm-module-types';

describe('src/background/services/balances/utils/isTokenWithBalanceAVM.ts', () => {
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
    type: VMModulesTokenType.NATIVE,
    name: 'Avalanche',
    symbol: 'AVAX',
    coingeckoId: 'btc',
    balance: 1n,
    balanceDisplayValue: '0.00000001',
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

  it('should return true when balance is TokenWithBalanceAVM ', () => {
    const result = isTokenWithBalanceAVM(tokenWithBalanceAVM);
    expect(result).toEqual(true);
  });

  it('should return fa;se when balance is not TokenWithBalanceAVM ', () => {
    const resultPVM = isTokenWithBalanceAVM(tokenWithBalancePVM);
    expect(resultPVM).toEqual(false);
    const resultBTC = isTokenWithBalanceAVM(tokenWithBalanceBTC);
    expect(resultBTC).toEqual(false);
    const resultEVM = isTokenWithBalanceAVM(tokenWithBalanceEVM);
    expect(resultEVM).toEqual(false);
  });
});
