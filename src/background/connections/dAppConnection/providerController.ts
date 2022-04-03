import { ExtensionConnectionMessage, DappRequestHandler } from '../models';
import { ConnectRequest } from '@src/background/services/web3/handlers/connect';
import { DAppProviderRequest } from './models';
import { EthAccountsRequest } from '@src/background/services/web3/handlers/eth_accounts';
import { EthSendTransactionRequest } from '@src/background/services/web3/handlers/eth_sendTransaction';
import { InitDappStateRequest } from '@src/background/services/web3/handlers/metamask_getProviderState';
import { SetDomainMetadataRequest } from '@src/background/services/web3/handlers/metamask_sendDomainMetadata';
import { PersonalEcRecoverRequest } from '@src/background/services/web3/handlers/personal_ecRecover';
import {
  PersonalSignRequest,
  SignRequest,
  SignTypedDataRequest,
  SignTypedDataV1Request,
  SignTypedDataV3Request,
  SignTypedDataV4Request,
} from '@src/background/services/messages/handlers/signMessage';
import { WalletAddChainRequest } from '@src/background/services/web3/handlers/wallet_addEthereumChain';
import { WalletGetPermissionsRequest } from '@src/background/services/web3/handlers/wallet_getPermissions';
import { WalletPermissionsRequest } from '@src/background/services/web3/handlers/wallet_requestPermissions';
import { Runtime } from 'webextension-polyfill-ts';
import { WalletSwitchEthereumChain } from '@src/background/services/web3/handlers/wallet_switchEthereumChain';
import { RequestProcessorPipeline } from '../RequestProcessorPipeline';
import { SiteMetadataMiddleware } from '../middlewares/SiteMetadataMiddleware';
import {
  LoggerMiddleware,
  SideToLog,
} from '../middlewares/RequestLoggerMiddleware';
import { PermissionMiddleware } from '../middlewares/PermissionMiddleware';
import { RequestHandlerMiddleware } from '../middlewares/RequestHandlerMiddleware';
import { resolve } from '@src/utils/promiseResolver';
import { responseLog } from '@src/utils/logging';
import { SettingsGetIsDefaultExtensionDappRequest } from '@src/background/services/settings/handlers/getIsDefaultExtension';
import { AvalancheGetContactsRequest } from '@src/background/services/contacts/handlers/avalanche_getContacts';
import { AvalancheGetAccountsRequest } from '@src/background/services/accounts/handlers/avalanche_getAccounts';
import { AvalancheGetBridgeStateRequest } from '@src/background/services/bridge/handlers/avalanche_getBridgeState';

const dappProviderRequestHandlerMap = new Map<
  DAppProviderRequest,
  DappRequestHandler
>([
  ConnectRequest,
  EthAccountsRequest,
  EthSendTransactionRequest,
  InitDappStateRequest,
  SetDomainMetadataRequest,
  PersonalEcRecoverRequest,
  SignRequest,
  SignTypedDataRequest,
  SignTypedDataV1Request,
  SignTypedDataV3Request,
  SignTypedDataV4Request,
  PersonalSignRequest,
  WalletAddChainRequest,
  WalletGetPermissionsRequest,
  WalletPermissionsRequest,
  WalletSwitchEthereumChain,
  SettingsGetIsDefaultExtensionDappRequest,
  AvalancheGetContactsRequest,
  AvalancheGetAccountsRequest,
  AvalancheGetBridgeStateRequest,
]);

export function providerConnectionHandlers(connection: Runtime.Port) {
  const pipeline = RequestProcessorPipeline(
    LoggerMiddleware(SideToLog.REQUEST),
    SiteMetadataMiddleware(connection),
    PermissionMiddleware(),
    RequestHandlerMiddleware(dappProviderRequestHandlerMap),
    LoggerMiddleware(SideToLog.RESPONSE)
  );

  return async (request: ExtensionConnectionMessage) => {
    const [context, error] = await resolve(
      pipeline.execute({
        // always start with authenticated false, middlewares take care of context updates
        authenticated: false,
        request: request,
      })
    );

    if (error) {
      const response = {
        ...request,
        data: {
          ...request.data,
          ...{ error },
        },
      };
      responseLog(`Web3 response (${request.data.method})`, response);
      connection.postMessage(response);
      return;
    } else if (context) {
      connection.postMessage(context.response);
    }
  };
}
