import { ExtensionRequest } from '@core/types';
import { buildRpcCall } from '@shared/tests/test-utils';
import { UnlockWalletHandler } from './unlockWalletState';
import { LockService } from '../LockService';
import { AccountsService } from '~/services/accounts/AccountsService';
import { StorageService } from '~/services/storage/StorageService';
import { addAllAccountsWithHistory } from '~/services/accounts/utils/addAllAccountsWithHistory';

jest.mock('../../accounts/utils/addAllAccountsWithHistory', () => ({
  addAllAccountsWithHistory: jest.fn(),
}));
describe('/service-worker/src/services/lock/handlers/unlockWalletState.ts', () => {
  const request = {
    id: '123',
    params: ['password'],
    method: ExtensionRequest.UNLOCK_WALLET,
  } as any;

  let lockServiceMock: LockService;
  let accountsServiceMock: AccountsService;
  let storageServiceMock: StorageService;

  beforeEach(() => {
    jest.resetAllMocks();
    lockServiceMock = new LockService({} as any, {} as any);
    accountsServiceMock = new AccountsService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    storageServiceMock = new StorageService({} as any);
  });
  describe('unlock', () => {
    it('should unlock and NOT add accounts', async () => {
      const handler = new UnlockWalletHandler(
        lockServiceMock,
        accountsServiceMock,
        storageServiceMock,
      );
      storageServiceMock.loadUnencrypted = jest.fn().mockResolvedValue(true);

      jest.spyOn(lockServiceMock, 'unlock').mockResolvedValue({} as any);

      await handler.handle(buildRpcCall(request));

      expect(lockServiceMock.unlock).toHaveBeenCalledWith('password');
    });

    it('should unlock and add accounts', async () => {
      const handler = new UnlockWalletHandler(
        lockServiceMock,
        accountsServiceMock,
        storageServiceMock,
      );
      storageServiceMock.loadUnencrypted = jest.fn().mockResolvedValue(false);
      storageServiceMock.saveUnencrypted = jest.fn();
      accountsServiceMock.getAccounts = jest.fn().mockResolvedValueOnce({
        primary: { asd: 1, asd2: 1 },
      });

      jest.spyOn(lockServiceMock, 'unlock').mockResolvedValue({} as any);

      await handler.handle(buildRpcCall(request));

      expect(await lockServiceMock.unlock).toHaveBeenCalledWith('password');
      expect(addAllAccountsWithHistory).toHaveBeenCalledTimes(2);
    });
  });
});
