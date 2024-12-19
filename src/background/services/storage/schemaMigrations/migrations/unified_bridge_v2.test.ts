import Joi from 'joi';

import unified_bridge_v2 from './unified_bridge_v2';

describe('background/services/storage/schemaMigrations/migrations/unified_bridge_v2', () => {
  const pendingTransfers = {
    '0xEthToAvalanche': {
      type: 'cctp',
      environment: 'production',
      fromAddress: '0xSourceAddress',
      toAddress: '0xTargetAddress',
      amount: 5000000,
      amountDecimals: 6,
      symbol: 'USDC',
      bridgeFee: 2000000,
      sourceChain: {
        chainName: 'Ethereum',
        chainId: 'eip155:1',
      },
      sourceStartedAt: 1725963300000,
      sourceTxHash: '0xSourceTxHash',
      sourceNetworkFee: 100_000_000,
      sourceConfirmationCount: 1,
      requiredSourceConfirmationCount: 6,

      targetChain: {
        chainName: 'Avalanche C-Chain',
        chainId: 'eip155:43114',
      },
      targetConfirmationCount: 0,
      requiredTargetConfirmationCount: 2,
    },
    '0xAvalancheToEth': {
      type: 'cctp',
      environment: 'production',
      fromAddress: '0xSourceAddress',
      toAddress: '0xTargetAddress',
      amount: 5000000,
      amountDecimals: 6,
      symbol: 'USDC',
      bridgeFee: 2000000,
      sourceChain: {
        chainName: 'Avalanche C-Chain',
        chainId: 'eip155:43114',
      },
      sourceStartedAt: 1725963300000,
      sourceTxHash: '0xSourceTxHash',
      sourceNetworkFee: 100_000_000,
      sourceConfirmationCount: 8,
      requiredSourceConfirmationCount: 6,
      targetChain: {
        chainName: 'Ethereum',
        chainId: 'eip155:1',
      },
      targetConfirmationCount: 2,
      requiredTargetConfirmationCount: 4,
      startBlockNumber: 1234567,
    },
  };

  const stateWithPendingTransfers = {
    pendingTransfers,
    addresses: ['0xTargetAddress'],
  };

  it('accepts correct inputs', () => {
    expect(
      unified_bridge_v2.previousSchema.validate(stateWithPendingTransfers),
    ).toEqual({
      error: undefined,
      value: stateWithPendingTransfers,
    });

    expect(
      unified_bridge_v2.previousSchema.validate({
        addresses: [],
        pendingTransfers: {},
        version: 1,
      }),
    ).toEqual({
      error: undefined,
      value: {
        addresses: [],
        pendingTransfers: {},
        version: 1,
      },
    });

    expect(
      unified_bridge_v2.previousSchema.validate({ pendingTransfers: {} }),
    ).toEqual({
      error: undefined,
      value: { pendingTransfers: {} },
    });

    expect(unified_bridge_v2.previousSchema.validate({})).toEqual({
      error: undefined,
      value: {},
    });
  });

  it('rejects incorrect inputs', () => {
    const stateWithMalformedPendingTransfers = {
      pendingTransfers: [{ what: 'is', that: '?' }],
    };

    const result = unified_bridge_v2.previousSchema.validate({
      pendingTransfers: [{ what: 'is', that: '?' }],
    });

    expect(result).toEqual({
      value: stateWithMalformedPendingTransfers,
      error: expect.any(Joi.ValidationError),
    });
  });

  it('migrates to v2 successfully', async () => {
    expect(await unified_bridge_v2.up(stateWithPendingTransfers)).toStrictEqual(
      {
        pendingTransfers: {
          '0xEthToAvalanche': {
            type: 'cctp',
            environment: 'production',
            fromAddress: '0xSourceAddress',
            toAddress: '0xTargetAddress',
            amount: 5000000,
            asset: {
              decimals: 6,
              symbol: 'USDC',
              name: 'USD Coin',
              type: 'erc20',
              address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            },
            bridgeFee: 2000000,
            sourceChain: {
              chainName: 'Ethereum',
              chainId: 'eip155:1',
            },
            sourceStartedAt: 1725963300000,
            sourceTxHash: '0xSourceTxHash',
            sourceNetworkFee: 100_000_000,
            sourceConfirmationCount: 1,
            sourceRequiredConfirmationCount: 6,
            targetChain: {
              chainName: 'Avalanche C-Chain',
              chainId: 'eip155:43114',
            },
            targetConfirmationCount: 0,
            targetRequiredConfirmationCount: 2,
            targetStartBlockNumber: undefined,
          },
          '0xAvalancheToEth': {
            type: 'cctp',
            environment: 'production',
            fromAddress: '0xSourceAddress',
            toAddress: '0xTargetAddress',
            amount: 5000000,
            asset: {
              decimals: 6,
              symbol: 'USDC',
              name: 'USD Coin',
              type: 'erc20',
              address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
            },
            bridgeFee: 2000000,
            sourceChain: {
              chainName: 'Avalanche C-Chain',
              chainId: 'eip155:43114',
            },
            sourceStartedAt: 1725963300000,
            sourceTxHash: '0xSourceTxHash',
            sourceNetworkFee: 100_000_000,
            sourceConfirmationCount: 8,
            sourceRequiredConfirmationCount: 6,
            targetChain: {
              chainName: 'Ethereum',
              chainId: 'eip155:1',
            },
            targetConfirmationCount: 2,
            targetRequiredConfirmationCount: 4,
            targetStartBlockNumber: 1234567n,
          },
        },
        version: 2,
      },
    );

    expect(
      await unified_bridge_v2.up({ addresses: ['0xTargetAddress'] }),
    ).toStrictEqual({
      pendingTransfers: {},
      version: 2,
    });

    expect(await unified_bridge_v2.up({ pendingTransfers: {} })).toStrictEqual({
      pendingTransfers: {},
      version: 2,
    });
  });
});
