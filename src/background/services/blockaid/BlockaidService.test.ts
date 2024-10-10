import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { FeatureFlagService } from '../featureFlags/FeatureFlagService';
import { FeatureGates } from '../featureFlags/models';
import { BlockaidService } from './BlockaidService';
import { MessageType } from '../messages/models';

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

const requestMock = {
  params: [
    '0xf3e1A73e0B91c510C3BB6f5D441d7B47bcE8338B',
    '{"domain":{"name":"USDC","version":"2","chainId":"1","verifyingContract":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"},"message":{"owner":"0xf3e1a73e0b91c510c3bb6f5d441d7b47bce8338b","spender":"0x0000b8a32b692d4b2073cda7085af11c9e190000","value":"115792089237316195423570985008687907853269984665640564039457584007913129639935","nonce":"0","deadline":"2034778242340"},"primaryType":"Permit","types":{"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"},{"name":"verifyingContract","type":"address"}],"Permit":[{"name":"owner","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"deadline","type":"uint256"}]}}',
  ],
  method: MessageType.ETH_SIGN,
  id: 'f233181c-2543-43e4-bdea-fd6928f480a8',
  site: {
    domain: 'examples.blockaid.io',
    tabId: 2099694006,
    icon: 'https://examples.blockaid.io/blockaid_favicon.png',
    name: 'Blockaid Integration Dapp',
  },
};

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
      jsonRpc: {
        scan: jest.fn(() => ({
          simulation: {
            status: 'Success',
            account_summary: {
              assets_diffs: assetsDiffsMock,
              total_usd_diff: { total: 1 },
              exposures: [],
            },
          },
          validation: { status: 'Success', result_type: 'Being' },
        })),
      },
    },
  }));
});

const networkMock = {
  chainName: 'test chain',
  chainId: 123,
  vmName: NetworkVMType.EVM,
  rpcUrl: 'https://rpcurl.example',
  explorerUrl: 'https://explorer.url',
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
        [FeatureGates.BLOCKAID_JSONRPC_SCAN]: true,
      },
    } as any;
  });

  it('should return `null` because the `JSONRPC SCAN` feature flag is disabled', async () => {
    featureFlagService = {
      featureFlags: {
        [FeatureGates.BLOCKAID_JSONRPC_SCAN]: false,
      },
    } as any;
    const service = new BlockaidService(featureFlagService);
    const result = await service.jsonRPCScan(
      networkMock.chainId.toString(),
      'toAddress',
      requestMock
    );
    expect(result).toBe(null);
  });

  it('should get the blockaid jsonRPC scan response', async () => {
    const service = new BlockaidService(featureFlagService);
    const result = await service.jsonRPCScan(
      networkMock.chainId.toString(),
      'toAddress',
      requestMock
    );
    expect(result?.validation).toEqual({
      result_type: 'Being',
      status: 'Success',
    });
  });
});
