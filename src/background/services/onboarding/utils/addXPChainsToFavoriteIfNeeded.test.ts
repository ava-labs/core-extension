import { BN } from 'bn.js';
import { ChainId } from '@avalabs/chains-sdk';
import { container } from 'tsyringe';

import { addXPChainToFavoriteIfNeeded } from './addXPChainsToFavoriteIfNeeded';

describe('src/background/services/onboarding/utils/addXPChainsToFavoriteIfNeeded.ts', () => {
  const accounts = [
    {
      addressPVM: 'addressPVM-1',
      addressAVM: 'addressAVM-1',
    },
    {
      addressPVM: 'addressPVM-2',
      addressAVM: 'addressAVM-2',
    },
  ] as const;

  const getBalancesForNetworks = jest.fn();
  const getNetwork = jest.fn();
  const addFavoriteNetwork = jest.fn();
  const getHistoryP = jest.fn();
  const getHistoryX = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    getNetwork.mockResolvedValue({} as any);
    jest
      .spyOn(container, 'resolve')
      .mockReturnValueOnce({ getBalancesForNetworks })
      .mockReturnValueOnce({ getNetwork, addFavoriteNetwork })
      .mockReturnValueOnce({ getHistory: getHistoryP })
      .mockReturnValueOnce({ getHistory: getHistoryX });
  });

  it('adds X-Chain if there is balance on one of the accounts', async () => {
    getBalancesForNetworks.mockResolvedValueOnce({
      [ChainId.AVALANCHE_X]: {
        [accounts[0].addressAVM]: {
          AVAX: {
            balance: new BN(1),
          },
        },
      },
    });

    await addXPChainToFavoriteIfNeeded(accounts as any);

    expect(addFavoriteNetwork).toHaveBeenCalledWith(ChainId.AVALANCHE_X);
  });

  it('adds P-Chain if there is balance on one of the accounts', async () => {
    getBalancesForNetworks.mockResolvedValueOnce({
      [ChainId.AVALANCHE_P]: {
        [accounts[1].addressPVM]: {
          AVAX: {
            balance: new BN(1),
          },
        },
      },
    });

    await addXPChainToFavoriteIfNeeded(accounts as any);

    expect(addFavoriteNetwork).toHaveBeenCalledWith(ChainId.AVALANCHE_P);
  });

  it('adds P-Chain if there was some activity on one of the accounts', async () => {
    getBalancesForNetworks.mockResolvedValue({
      [ChainId.AVALANCHE_P]: {},
      [ChainId.AVALANCHE_X]: {},
    });

    getHistoryP.mockResolvedValueOnce([{ anything: ':-)' } as any]); // P-chain info is fetched first

    await addXPChainToFavoriteIfNeeded(accounts as any);

    expect(addFavoriteNetwork).toHaveBeenCalledWith(ChainId.AVALANCHE_P);
  });

  it('adds X-Chain if there was some activity on one of the accounts', async () => {
    getBalancesForNetworks.mockResolvedValue({
      [ChainId.AVALANCHE_P]: {},
      [ChainId.AVALANCHE_X]: {},
    });

    getHistoryP
      .mockRejectedValueOnce([]) // P-chain call for account 1
      .mockRejectedValueOnce([]); // P-chain call for account 2

    getHistoryX.mockResolvedValueOnce([{ anything: ':-)' } as any]); // X-chain call for account 1

    await addXPChainToFavoriteIfNeeded(accounts as any);

    expect(addFavoriteNetwork).toHaveBeenCalledWith(ChainId.AVALANCHE_X);
  });

  it('does not add any networks if there is no balance or activity', async () => {
    getBalancesForNetworks.mockResolvedValue({
      [ChainId.AVALANCHE_P]: {},
      [ChainId.AVALANCHE_X]: {},
    });

    await addXPChainToFavoriteIfNeeded(accounts as any);

    expect(addFavoriteNetwork).not.toHaveBeenCalled();
  });
});
