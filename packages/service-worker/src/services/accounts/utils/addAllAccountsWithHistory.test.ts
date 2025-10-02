import { container } from 'tsyringe';
import { addAllAccountsWithHistory } from './addAllAccountsWithHistory';

describe('/service-worker/src/services/accounts/utils/addAllAccountsWithHistory.tsx', () => {
  const getTransactionHistory = jest.fn();
  const addPrimaryAccount = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();

    const loadModule = jest.fn().mockResolvedValue({ getTransactionHistory });

    const getAddressesForAccount = jest
      .fn()
      .mockResolvedValue({ addressC: 'addressC' });

    const getAvalancheNetwork = jest
      .fn()
      .mockResolvedValue({ caipId: 'caipId' });

    jest
      .spyOn(container, 'resolve')
      .mockReturnValueOnce({ loadModule })
      .mockReturnValueOnce({ getAddressesForAccount, addPrimaryAccount })
      .mockReturnValueOnce({ getAvalancheNetwork });
  });

  it.only('should add accounts with history and stop it after two empty history', async () => {
    getTransactionHistory
      .mockResolvedValueOnce({
        transactions: [1],
      })
      .mockResolvedValueOnce({
        transactions: [],
      })
      .mockResolvedValueOnce({
        transactions: [1],
      })
      .mockResolvedValueOnce({
        transactions: [],
      })
      .mockResolvedValueOnce({
        transactions: [1],
      })
      .mockResolvedValueOnce({
        transactions: [1],
      })
      .mockResolvedValueOnce({
        transactions: [],
      })
      .mockResolvedValueOnce({
        transactions: [],
      })
      .mockResolvedValue({ getTransactionHistory });

    await addAllAccountsWithHistory({ walletId: 'wallet-id' });
    expect(addPrimaryAccount).toHaveBeenCalledTimes(6);
  });
});
