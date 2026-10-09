import { BitcoinProviderAbstract } from '@avalabs/core-wallets-sdk';
import { BtcTransactionRequest } from '@core/types';
import { prepareBtcTxForLedger } from './prepareBtcTxForLedger';

const input = (txHash: string, index: number) => ({
  txHash,
  index,
  value: 1000,
  script: '0014',
  blockHeight: 1,
  confirmations: 1,
});

describe('src/background/services/wallet/utils/prepareBtcTxForLedger', () => {
  it('attaches the previous transaction hex to every input', async () => {
    const provider = {
      getTxHex: jest.fn(async (hash: string) => `hex-of-${hash}`),
    } as unknown as BitcoinProviderAbstract;
    const tx: BtcTransactionRequest = {
      inputs: [input('aa', 0), input('bb', 1), input('aa', 2)],
      outputs: [{ address: 'bc1q', value: 500 }],
    };

    const prepared = await prepareBtcTxForLedger(tx, provider);

    expect(prepared.inputs.map((i) => i.txHex)).toEqual([
      'hex-of-aa',
      'hex-of-bb',
      'hex-of-aa',
    ]);
    expect(prepared.outputs).toBe(tx.outputs);
    expect(provider.getTxHex).toHaveBeenCalledTimes(2);
  });
});
