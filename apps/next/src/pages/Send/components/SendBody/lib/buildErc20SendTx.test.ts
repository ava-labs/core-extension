import { Erc20TokenBalance, NetworkFee } from '@core/types';

import { buildErc20SendTx } from './buildErc20SendTx';

jest.mock('ethers', () => ({
  Contract: jest.fn().mockImplementation(() => ({
    transfer: {
      populateTransaction: jest.fn().mockResolvedValue({ to: '0xtoken' }),
    },
  })),
}));

const networkFee = {
  low: { maxFeePerGas: 1n, maxPriorityFeePerGas: 1n },
  medium: { maxFeePerGas: 2n, maxPriorityFeePerGas: 2n },
  high: { maxFeePerGas: 16n, maxPriorityFeePerGas: 3n },
} as unknown as NetworkFee;

const token = { address: '0xtoken' } as unknown as Erc20TokenBalance;

describe('buildErc20SendTx', () => {
  it.each([
    ['low', '0x1', '0x1'],
    ['medium', '0x2', '0x2'],
    ['high', '0x10', '0x3'],
  ] as const)('uses the %s fee preset', async (feePreset, max, priority) => {
    const tx = await buildErc20SendTx('0xfrom', {} as any, networkFee, {
      address: '0xto',
      amount: 1n,
      token,
      feePreset,
    });

    expect(tx.maxFeePerGas).toBe(max);
    expect(tx.maxPriorityFeePerGas).toBe(priority);
  });
});
