import { Avalanche } from '@avalabs/core-wallets-sdk';
import { getMaxUtxoSet } from './getMaxUtxos';
import { AVALANCHE_P_DEV_NETWORK } from '@avalabs/core-chains-sdk';
import { ethErrors } from 'eth-rpc-errors';
import { CommonError } from '@core/types';

jest.mock('@avalabs/core-wallets-sdk');

describe('src/pages/Send/utils/getMaxUtxos', () => {
  const getUTXOs = jest.fn();

  const mockedWallet = {
    getUTXOs,
  } as any;

  beforeEach(() => {
    jest.spyOn(Avalanche, 'getMaximumUtxoSet').mockReturnValue([]);
    jest.spyOn(Avalanche, 'sortUTXOsByAmount');

    getUTXOs.mockResolvedValue({
      getUTXOs: () => [],
    });
  });

  it('requires feeState for post-Etna transactions', async () => {
    const provider = {
      isEtnaEnabled: jest.fn().mockReturnValue(true),
    } as any;

    try {
      await getMaxUtxoSet(
        false,
        provider,
        mockedWallet,
        AVALANCHE_P_DEV_NETWORK,
      );
      fail('The call above should have failed');
    } catch (err) {
      expect(err).toEqual(
        ethErrors.rpc.internal({
          data: { reason: CommonError.UnknownNetworkFee },
        }),
      );
    }
  });

  it('passes feeState to the SDK call', async () => {
    const provider = {
      isEtnaEnabled: jest.fn().mockReturnValue(true),
      getAvaxID: () => 'avax-id',
    } as any;
    const feeState = { price: 2n } as any;

    await getMaxUtxoSet(
      false,
      provider,
      mockedWallet,
      AVALANCHE_P_DEV_NETWORK,
      feeState,
    );

    expect(Avalanche.getMaximumUtxoSet).toHaveBeenCalledWith({
      wallet: mockedWallet,
      utxos: [],
      sizeSupportedTx: Avalanche.SizeSupportedTx.BaseP,
      limit: undefined,
      feeState,
    });
  });
});
