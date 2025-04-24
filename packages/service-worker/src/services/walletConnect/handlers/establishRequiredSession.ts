import { ExtensionRequest } from '@core/types/src/models';
import { ExtensionRequestHandler } from '../../../connections/models';
import { injectable } from 'tsyringe';
import { WalletConnectService } from '../WalletConnectService';
import { WalletConnectSessionInfo } from '@core/types/src/models';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.WALLET_CONNECT_ESTABLISH_REQUIRED_SESSION,
  null | WalletConnectSessionInfo,
  [address: string, chainId: number]
>;

@injectable()
export class EstablishRequiredSession implements HandlerType {
  method = ExtensionRequest.WALLET_CONNECT_ESTABLISH_REQUIRED_SESSION as const;

  constructor(private walletConnectService: WalletConnectService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [fromAddress, chainId] = request.params ?? [];
    const { tabId } = request;

    const session = await this.walletConnectService.establishRequiredSession({
      fromAddress,
      chainId,
      tabId,
    });

    return {
      ...request,
      result: session,
    };
  };
}
