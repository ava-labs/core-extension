import {
  AVALANCHE_XP_TEST_NETWORK,
  ChainId,
  NetworkVMType,
} from '@avalabs/chains-sdk';
import { Account, AccountType } from '../accounts/models';
import BN from 'bn.js';
import {
  AggregatedAssetAmount,
  PrimaryNetwork,
  PrimaryNetworkAssetType,
  PrimaryNetworkChainName,
} from '@avalabs/glacier-sdk';
import { BalancesServiceAVM } from './BalancesServiceAVM';
import * as Sentry from '@sentry/browser';
import { AnalyticsConsent, Languages, ThemeVariant } from '../settings/models';

jest.mock('@sentry/browser');

describe('src/background/services/balances/BalancesServiceAVM.ts', () => {
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
  let service: BalancesServiceAVM;

  const account: Account = {
    id: '123',
    name: 'account name',
    addressBTC: 'addressBTC',
    addressC: 'addressC',
    addressAVM: 'addressAVM',
    index: 0,
    type: AccountType.PRIMARY,
    walletId: 'walletId',
  };

  const xchain = {
    ...AVALANCHE_XP_TEST_NETWORK,
    vmName: NetworkVMType.AVM,
    chainId: ChainId.AVALANCHE_TEST_X,
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

  const xchainBalanceFromGlacier = {
    balances: {
      locked: [assetAmount],
      unlocked: [assetAmount],
      atomicMemoryUnlocked: [assetAmount],
      atomicMemoryLocked: [assetAmount],
    },
    chainInfo: {
      chainName: PrimaryNetworkChainName.X_CHAIN,
      network: PrimaryNetwork.FUJI,
    },
  };
  const finishMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (Sentry.startTransaction as jest.Mock).mockReturnValue({
      finish: finishMock,
    });
    (tokenPricesServiceMock.getPriceByCoinId as jest.Mock).mockResolvedValue(5);
    (glacierServiceMock.getChainBalance as jest.Mock).mockResolvedValue(
      xchainBalanceFromGlacier
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

    service = new BalancesServiceAVM(
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
        network: xchain,
      });

      const expected = {
        addressAVM: {
          AVAX: {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 9,
            description: '',
            logoUri:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
            type: 'NATIVE',
            balance: new BN(4000000000),
            balanceUSD: 20,
            balanceDisplayValue: '4',
            balanceUsdDisplayValue: '20.00',
            priceUSD: 5,
            available: new BN(1000000000),
            availableUSD: 5,
            availableDisplayValue: '1',
            availableUsdDisplayValue: '5.00',
            utxos: xchainBalanceFromGlacier.balances,
            locked: 1,
            unlocked: 1,
            atomicMemoryLocked: 1,
            atomicMemoryUnlocked: 1,
          },
        },
      };

      expect(result).toEqual(expected);
      expect(finishMock).toHaveBeenCalled();
      expect(glacierServiceMock.getChainBalance).toHaveBeenCalledWith({
        addresses: 'addressAVM',
        blockchainId: 'x-chain',
        network: 'fuji',
      });
    });
  });
});
