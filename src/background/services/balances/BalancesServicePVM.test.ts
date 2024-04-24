import { AVALANCHE_XP_TEST_NETWORK, NetworkVMType } from '@avalabs/chains-sdk';
import { AccountType } from '../accounts/models';
import BN from 'bn.js';
import {
  AggregatedAssetAmount,
  PrimaryNetwork,
  PrimaryNetworkAssetType,
  PrimaryNetworkChainName,
} from '@avalabs/glacier-sdk';
import { BalancesServicePVM } from './BalancesServicePVM';
import * as Sentry from '@sentry/browser';
import { AnalyticsConsent, Languages, ThemeVariant } from '../settings/models';

jest.mock('@sentry/browser');

describe('src/background/services/balances/BalancesServicePVM.ts', () => {
  const glacierServiceMock = {
    isNetworkSupported: jest.fn(),
    getChainBalance: jest.fn(),
  } as any;
  const tokenPricesServiceMock = {
    getPriceByCoinId: jest.fn(),
  } as any;
  const settingsServiceMock = {
    getSettings: jest.fn(),
  } as any;
  let service: BalancesServicePVM;

  const account = {
    id: '123',
    name: 'account name',
    addressBTC: 'addressBTC',
    addressC: 'addressC',
    addressPVM: 'addressPVM',
    index: 0,
    type: AccountType.PRIMARY,
    walletId: 'walletId',
  };

  const pchain = {
    ...AVALANCHE_XP_TEST_NETWORK,
    vmName: NetworkVMType.PVM,
  };

  const assetAmount: AggregatedAssetAmount = {
    assetId: 'assetId',
    name: 'assetName',
    symbol: 'AVAX',
    denomination: 9,
    type: PrimaryNetworkAssetType.SECP256K1,
    amount: '1000000000',
    utxoCount: 1,
  };

  const pchainBalanceFromGlacier = {
    balances: {
      unlockedUnstaked: [assetAmount],
      unlockedStaked: [assetAmount],
      lockedPlatform: [assetAmount],
      lockedStakeable: [assetAmount],
      lockedStaked: [assetAmount],
      pendingStaked: [assetAmount],
      atomicMemoryUnlocked: [assetAmount],
      atomicMemoryLocked: [assetAmount],
    },
    chainInfo: {
      chainName: PrimaryNetworkChainName.P_CHAIN,
      network: PrimaryNetwork.FUJI,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (Sentry.startTransaction as jest.Mock).mockReturnValue({
      finish: jest.fn(),
    });
    (tokenPricesServiceMock.getPriceByCoinId as jest.Mock).mockResolvedValue(5);
    (glacierServiceMock.getChainBalance as jest.Mock).mockResolvedValue(
      pchainBalanceFromGlacier
    );
    (settingsServiceMock.getSettings as jest.Mock).mockResolvedValue({
      currency: 'USD',
      customTokens: [],
      showTokensWithoutBalances: false,
      theme: ThemeVariant.DARK,
      tokensVisibility: {},
      analyticsConsent: AnalyticsConsent.Approved,
      language: Languages.EN,
    });

    service = new BalancesServicePVM(
      glacierServiceMock,
      tokenPricesServiceMock,
      settingsServiceMock
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getBalances', () => {
    it('should get balance as expected', async () => {
      const result = await service.getBalances({
        accounts: [account],
        network: pchain,
      });

      const expected = {
        addressPVM: {
          AVAX: {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 9,
            description: '',
            logoUri:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
            type: 'NATIVE',
            balance: new BN(8000000000),
            balanceUSD: 40,
            balanceDisplayValue: '8',
            balanceUsdDisplayValue: '40.00',
            priceUSD: 5,
            pchainBalance: {
              available: new BN(1000000000),
              availableUSD: 5,
              availableDisplayValue: '1',
              availableUsdDisplayValue: '5.00',
              utxos: pchainBalanceFromGlacier.balances,
              lockedStaked: 1,
              lockedStakeable: 1,
              lockedPlatform: 1,
              atomicMemoryLocked: 1,
              atomicMemoryUnlocked: 1,
              unlockedUnstaked: 1,
              unlockedStaked: 1,
              pendingStaked: 1,
            },
          },
        },
      };

      expect(result).toEqual(expected);
    });
  });
});
