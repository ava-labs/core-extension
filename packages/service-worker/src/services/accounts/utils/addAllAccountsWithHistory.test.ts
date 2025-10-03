import { container } from 'tsyringe';
import { addAllAccountsWithHistory } from './addAllAccountsWithHistory';

describe('/service-worker/src/services/accounts/utils/addAllAccountsWithHistory.tsx', () => {
  const getTransactionHistory = jest.fn();
  const addPrimaryAccount = jest.fn();
  const getAccounts = jest.fn();
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
      .mockReturnValueOnce({
        getAddressesForAccount,
        addPrimaryAccount,
        getAccounts,
      })
      .mockReturnValueOnce({ getAvalancheNetwork });
  });

  it.only('should add (5) accounts with history and stop it after two empty history', async () => {
    // 0 -- activity
    // 1 -- no activity
    // 2 -- activity
    // 3 -- no activity
    // 4 -- activity --- stop here, we add all the account from here and up, and discard the ones below
    // 5 -- no activity
    // 6 -- no activity
    // 7 -- activity
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
        transactions: [],
      })
      .mockResolvedValueOnce({
        transactions: [],
      })
      .mockResolvedValueOnce({
        transactions: [1],
      })
      .mockResolvedValue({ getTransactionHistory });

    await addAllAccountsWithHistory({ walletId: 'wallet-id' });
    expect(addPrimaryAccount).toHaveBeenCalledTimes(5);
  });
});
