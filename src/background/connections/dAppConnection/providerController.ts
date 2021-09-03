import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
} from '../models';
import { ConnectRequest } from '@src/background/services/web3/handlers/connect';
import { DAppProviderRequest } from './models';
import { EthAccountsRequest } from '@src/background/services/web3/handlers/eth_accounts';
import { EthGetBalanceRequest } from '@src/background/services/web3/handlers/eth_getBalance';
import { EthSendTransactionRequest } from '@src/background/services/web3/handlers/eth_sendTransaction';
import { InitDappStateRequest } from '@src/background/services/web3/handlers/metamask_getProviderState';
import { SetDomainMetadataRequest } from '@src/background/services/web3/handlers/metamask_sendDomainMetadata';
import { PersonalEcRecoverRequest } from '@src/background/services/web3/handlers/personal_ecRecover';
import {
  PersonalSignRequest,
  SignTypedDataRequest,
  SignTypedDataV3Request,
  SignTypedDataV4Request,
} from '@src/background/services/web3/handlers/signMessage';
import { WalletAddChainRequest } from '@src/background/services/web3/handlers/wallet_addEthereumChain';
import { WalletGetPermissionsRequest } from '@src/background/services/web3/handlers/wallet_getPermissions';
import { WalletPermissionsRequest } from '@src/background/services/web3/handlers/wallet_requestPermissions';
import { Runtime } from 'webextension-polyfill-ts';
import { engine } from '@src/utils/jsonRpcEngine';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { requestLog, responseLog } from '@src/utils/logging';
import { resolve } from '@src/utils/promiseResolver';

const dappProviderRequestHandlerMap = new Map<
  DAppProviderRequest,
  ConnectionRequestHandler
>([
  ConnectRequest,
  EthAccountsRequest,
  EthGetBalanceRequest,
  EthSendTransactionRequest,
  InitDappStateRequest,
  SetDomainMetadataRequest,
  PersonalEcRecoverRequest,
  SignTypedDataRequest,
  SignTypedDataV3Request,
  SignTypedDataV4Request,
  PersonalSignRequest,
  WalletAddChainRequest,
  WalletGetPermissionsRequest,
  WalletPermissionsRequest,
]);

export function providerConnectionHandlers(connection: Runtime.Port) {
  /**
   * Domain is per connection so this needs to remain an closure to the connection
   */
  const domain = new BehaviorSubject('');
  return async (request: ExtensionConnectionMessage) => {
    const { data } = request;

    const handler = dappProviderRequestHandlerMap.get(
      data.method as DAppProviderRequest
    );

    requestLog(`Web3 request (${data.method})`, data);

    if (data.method === DAppProviderRequest.DOMAIN_METADATA_METHOD) {
      domain.next((data?.params as any).name);
    }

    const domainCache = await firstValueFrom(
      domain.pipe(filter((val) => !!val))
    );

    const promise: Promise<any> = handler
      ? handler({ ...request.data, domain: domainCache }).then(
          ({ error, result }) => {
            return {
              ...request,
              data: {
                ...data,
                ...(error ? { error } : { result }),
              },
            };
          }
        )
      : resolve(engine().then((e) => e.handle(data as any))).then(
          ([result, error]) => {
            return {
              ...request,
              data: {
                ...data,
                ...(error ? { error } : result),
              },
            };
          }
        );

    const response = await promise;

    responseLog(`Web3 response (${data.method})`, response);

    connection.postMessage(response);
  };
}
