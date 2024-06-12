import { NetworkVMType } from '@avalabs/chains-sdk';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FeatureGates } from '../featureFlags/models';
import { BlockaidService } from './BlockaidService';

jest.mock('../featureFlags/FeatureFlagService');

const rawValue = '0x2c68af0bb140000';
const nftValue = '0x2c6341234';

const nftDetails = {
  type: 'ERC721',
  address: 'nftAddress',
  logo_url: 'logoUrl',
  name: 'Test EXPERIMENT ',
  symbol: 'EXPERIMENT',
};

const tokenDetails = {
  type: 'NATIVE',
  chain_name: 'Avalanche C-Chain',
  decimals: 18,
  chain_id: 43114,
  logo_url: 'https://cdn.blockaid.io/chain/avalanche',
  name: 'Avalanche',
  symbol: 'AVAX',
};

const assetsDiffsMock = [
  {
    asset: {
      ...tokenDetails,
    },
    in: [],
    out: [
      {
        usd_price: '7.266000000000000014',
        summary: 'Sent 0.2 AVAX',
        value: '0.200000000000000011',
        raw_value: rawValue,
      },
    ],
  },
  {
    asset: {
      ...nftDetails,
    },
    in: [],
    out: [
      {
        summary: 'Sent Test EXPERIMENT',
        token_id: 'tokeId',
        logo_url: 'logoUrl',
        value: nftValue,
      },
    ],
  },
];

jest.mock('@blockaid/client', () => {
  return jest.fn(() => ({
    evm: {
      transaction: {
        scan: jest.fn(() => ({
          simulation: {
            status: 'Success',
            account_summary: {
              assets_diffs: assetsDiffsMock,
              total_usd_diff: { total: 1 },
              exposures: [],
            },
          },
          validation: { status: 'Success', result_type: 'Malicious' },
        })),
      },
    },
  }));
});

const txMock = {
  chainId: '0xa86a',
  from: 'fromAddress',
  to: 'toAddress',
  value: '200000000000000000',
  type: 2,
  maxFeePerGas: '0xbfda3a300',
  maxPriorityFeePerGas: '0x1dcd6500',
  gasLimit: '0x5208',
};

const networkMock = {
  chainName: 'test chain',
  chainId: 123,
  vmName: NetworkVMType.EVM,
  rpcUrl: 'https://rpcurl.example',
  networkToken: {
    name: 'test network token',
    symbol: 'TNT',
    description: '',
    decimals: 18,
    logoUri: '',
  },
  logoUri: '',
  primaryColor: 'blue',
  isTestnet: false,
};
describe('background/services/blockaid/BlockaidService', () => {
  let featureFlagService: FeatureFlagService;
  beforeEach(() => {
    jest.clearAllMocks();

    featureFlagService = {
      featureFlags: {
        [FeatureGates.BLOCKAID_TRANSACTION_SCAN]: true,
      },
    } as any;
  });

  it('should throw an error because the feature flag is disabled', async () => {
    featureFlagService = {
      featureFlags: {
        [FeatureGates.BLOCKAID_TRANSACTION_SCAN]: false,
      },
    } as any;
    const service = new BlockaidService(featureFlagService);
    await expect(
      service.parseTransaction('core.test', networkMock, txMock)
    ).rejects.toThrow('The transaction scanning is disabled');
  });

  it('should scan the transaction', async () => {
    const service = new BlockaidService(featureFlagService);
    const transactionScanSpy = jest.spyOn(service, 'transactionScan');
    await service.parseTransaction('core.test', networkMock, txMock);
    expect(transactionScanSpy).toHaveBeenCalled();
  });

  it('should return the `isMalicious` as true', async () => {
    const service = new BlockaidService(featureFlagService);
    const result = await service.parseTransaction(
      'core.test',
      networkMock,
      txMock
    );
    expect(result).toMatchObject({
      isMalicious: true,
      isSuspicious: false,
      preExecSuccess: true,
    });
  });

  it('should parse the token data correctly', async () => {
    const service = new BlockaidService(featureFlagService);
    const result = await service.parseTransaction(
      'core.test',
      networkMock,
      txMock
    );
    expect(result).toMatchObject({
      fromAddress: 'fromAddress',
      balanceChange: {
        usdValueChange: 1,
        sendTokenList: [
          {
            usdValue: 7.266,
            amount: BigInt(rawValue),
            symbol: tokenDetails.symbol,
            name: tokenDetails.name,
            decimals: tokenDetails.decimals,
            address: 'avax',
          },
        ],
      },
    });
  });

  it('should parse the nft data correctly', async () => {
    const service = new BlockaidService(featureFlagService);
    const result = await service.parseTransaction(
      'core.test',
      networkMock,
      txMock
    );
    expect(result).toMatchObject({
      fromAddress: 'fromAddress',
      balanceChange: {
        sendNftList: [
          {
            amount: BigInt(nftValue),
            symbol: nftDetails.symbol,
            name: nftDetails.name,
            address: nftDetails.address,
          },
        ],
      },
    });
  });
});
