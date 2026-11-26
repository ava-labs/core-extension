import { ServiceType, Transfer } from '@avalabs/fusion-sdk';

import { getTransferTokenLabel } from './getTransferTokenLabel';

jest.mock('@/components/TokenSelect/utils', () => ({
  getChainFilterName: (chainId: number) =>
    chainId === 43114 ? 'C-Chain' : 'Ethereum',
}));

const makeTransfer = (type: ServiceType) =>
  ({
    type,
    sourceAsset: { symbol: 'AVAX' },
    targetAsset: { symbol: 'USDC' },
    sourceChain: { chainId: 'eip155:43114' },
    targetChain: { chainId: 'eip155:1' },
  }) as unknown as Transfer;

describe('getTransferTokenLabel', () => {
  it('appends the chain name for Avalanche CCT transfers', () => {
    const transfer = makeTransfer(ServiceType.AVALANCHE_CCT);

    expect(getTransferTokenLabel(transfer, 'source')).toBe('AVAX (C-Chain)');
    expect(getTransferTokenLabel(transfer, 'target')).toBe('USDC (Ethereum)');
  });

  it('returns only the symbol for other service types', () => {
    const transfer = makeTransfer(ServiceType.MARKR);

    expect(getTransferTokenLabel(transfer, 'source')).toBe('AVAX');
    expect(getTransferTokenLabel(transfer, 'target')).toBe('USDC');
  });
});
