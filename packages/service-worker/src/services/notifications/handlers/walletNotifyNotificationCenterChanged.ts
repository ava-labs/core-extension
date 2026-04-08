import {
  DAppProviderRequest,
  DAppRequestHandler,
  JsonRpcRequestParams,
} from '@core/types';
import { injectable } from 'tsyringe';
import { NotificationsService } from '../NotificationsService';

type Params = [] | undefined;

@injectable()
export class WalletNotifyNotificationCenterChangedHandler extends DAppRequestHandler<
  Params,
  null
> {
  methods = [DAppProviderRequest.WALLET_NOTIFY_NOTIFICATION_CENTER_CHANGED];

  constructor(private notificationsService: NotificationsService) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, Params>,
  ) => {
    const { request } = rpcCall;

    this.notificationsService.notifyNotificationCenterChanged();

    return {
      ...request,
      result: null,
    };
  };

  handleUnauthenticated = ({ request }) => ({
    ...request,
    error: 'account not connected',
  });
}
