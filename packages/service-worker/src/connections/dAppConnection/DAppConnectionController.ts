import { resolve } from '@avalabs/core-utils-sdk';
import {
  connectionLog,
  disconnectLog,
  eventLog,
  responseLog,
} from '@core/common';
import { injectable, injectAll } from 'tsyringe';
import { Runtime } from 'webextension-polyfill';
import { Context, Pipeline } from '../middlewares/models';
import { PermissionMiddleware } from '../middlewares/PermissionMiddleware';
import { DAppRequestHandlerMiddleware } from '../middlewares/DAppRequestHandlerMiddleware';
import {
  LoggerMiddleware,
  SideToLog,
} from '../middlewares/RequestLoggerMiddleware';
import { SiteMetadataMiddleware } from '../middlewares/SiteMetadataMiddleware';
import { RequestProcessorPipeline } from '../RequestProcessorPipeline';
import { PermissionsService } from '../../services/permissions/PermissionsService';
import { AccountsService } from '../../services/accounts/AccountsService';

import './registry';
import { NetworkService } from '../../services/network/NetworkService';
import { LockService } from '../../services/lock/LockService';
import { PortConnection } from '@core/messaging';
import {
  DAppProviderRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  JsonRpcFailure,
  JsonRpcRequest,
  JsonRpcSuccess,
  ConnectionController,
  DAppEventEmitter,
} from '@core/types';
import { Monitoring } from '@core/common';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { ActiveNetworkMiddleware } from '../middlewares/ActiveNetworkMiddleware';
import { AvalancheTxContextMiddleware } from '../middlewares/AvalancheTxContextMiddleware';
import { SecretsService } from '~/services/secrets/SecretsService';

/**
 * This needs to be a controller per dApp, to separate messages
 * Do not make it a singleton otherwise dApps would potentially get each other's messages
 */
@injectable()
export class DAppConnectionController implements ConnectionController {
  private pipeline?: Pipeline<
    JsonRpcRequest,
    JsonRpcSuccess<unknown> | JsonRpcFailure
  >;
  private connection?: PortConnection;

  constructor(
    @injectAll('DAppRequestHandler') private handlers: DAppRequestHandler[],
    @injectAll('DAppEventEmitter') private eventEmitters: DAppEventEmitter[],
    private permissionsService: PermissionsService,
    private accountsService: AccountsService,
    private networkService: NetworkService,
    private secretsService: SecretsService,
    private lockService: LockService,
    private moduleManager: ModuleManager,
  ) {
    this.onRequest = this.onRequest.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onEvent = this.onEvent.bind(this);
  }

  connect(connection: Runtime.Port) {
    this.connection = new PortConnection(connection);
    this.pipeline = RequestProcessorPipeline<
      JsonRpcRequest,
      JsonRpcSuccess<unknown> | JsonRpcFailure
    >(
      // TODO: fix this in https://ava-labs.atlassian.net/browse/CP-5738
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      LoggerMiddleware(SideToLog.REQUEST),
      SiteMetadataMiddleware(connection),
      PermissionMiddleware(
        this.permissionsService,
        this.accountsService,
        this.lockService,
      ),
      ActiveNetworkMiddleware(this.networkService),
      AvalancheTxContextMiddleware(this.accountsService, this.secretsService),
      DAppRequestHandlerMiddleware(this.handlers, this.moduleManager),
      LoggerMiddleware(SideToLog.RESPONSE),
    );

    connectionLog('dApp Provider');

    this.connection.connect((message) => {
      return this.onRequest(message);
    });
    this.connection.on('disconnect', this.disconnect);
    this.eventEmitters.forEach((emitter) => {
      emitter.addListener(this.onEvent);
      emitter.setConnectionInfo({
        domain: new URL(connection?.sender?.url || '').hostname,
        tabId: connection.sender?.tab?.id,
      });
    });
  }

  disconnect() {
    this.connection?.dispose();
    this.eventEmitters.forEach((emitter) =>
      emitter.removeListener(this.onEvent),
    );
    disconnectLog('dApp Provider');
  }

  needToPost(
    context: Context<JsonRpcRequest, JsonRpcSuccess<unknown> | JsonRpcFailure>,
  ): boolean {
    return context.response !== DEFERRED_RESPONSE;
  }

  private async onRequest(request: JsonRpcRequest) {
    if (!this.pipeline || !this.connection) {
      throw Error('dAppConnectionController is not connected to a port');
    }

    const [context, error] = await resolve(
      this.pipeline.execute({
        // always start with authenticated false, middlewares take care of context updates
        authenticated: false,
        request: {
          ...request,
        },
      }),
    );

    if (error) {
      responseLog(`Web3 response (${request.params.request.method})`, {
        ...{ error },
      });
      throw error;
    } else if (context) {
      if ((context.response as JsonRpcFailure)?.error) {
        throw (context.response as JsonRpcFailure).error;
      } else if (this.needToPost(context)) {
        return (context.response as JsonRpcSuccess)?.result;
      } else {
        return DEFERRED_RESPONSE;
      }
    }
  }

  private onEvent(evt: any) {
    try {
      if (Object.values(DAppProviderRequest).includes(evt.method)) {
        this.connection?.deferredResponse(evt.id, evt.result, evt.error);
      } else {
        eventLog('Web 3 event', evt);
        this.connection?.message(evt);
      }
    } catch (e) {
      Monitoring.sentryCaptureException(
        e as Error,
        Monitoring.SentryExceptionTypes.DAPP_CONNECTION_EVENT,
      );
      console.error(e);
    }
  }
}
