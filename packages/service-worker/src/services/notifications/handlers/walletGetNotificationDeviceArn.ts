import {
  DAppProviderRequest,
  DAppRequestHandler,
  JsonRpcRequestParams,
  NotificationsClientIdStorage,
} from '@core/types';
import { injectable } from 'tsyringe';
import { StorageService } from '../../storage/StorageService';
import { NOTIFICATIONS_CLIENT_ID_STORAGE_KEY } from '../constants';

export type WalletGetNotificationDeviceArnResult = {
  deviceArn: string | undefined;
};

type Params = [] | undefined;

@injectable()
export class WalletGetNotificationDeviceArnHandler extends DAppRequestHandler<
  Params,
  WalletGetNotificationDeviceArnResult
> {
  methods = [DAppProviderRequest.WALLET_GET_NOTIFICATION_DEVICE_ARN];

  constructor(private storageService: StorageService) {
    super();
  }

  handleAuthenticated = async ({
    request,
  }: JsonRpcRequestParams<DAppProviderRequest, Params>) => {
    const stored =
      await this.storageService.loadUnencrypted<NotificationsClientIdStorage>(
        NOTIFICATIONS_CLIENT_ID_STORAGE_KEY,
      );

    return {
      ...request,
      result: { deviceArn: stored?.clientId },
    };
  };

  handleUnauthenticated = ({ request }) => ({
    ...request,
    error: 'account not connected',
  });
}
