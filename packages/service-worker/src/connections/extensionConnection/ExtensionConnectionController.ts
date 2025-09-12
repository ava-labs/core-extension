import { injectable, injectAll, injectAllWithTransform } from 'tsyringe';
import { runtime, Runtime } from 'webextension-polyfill';
import { ExtensionRequestHandlerMiddleware } from '../middlewares/ExtensionRequestHandlerMiddleware';
import {
  DEFERRED_RESPONSE,
  ConnectionController,
  DAppEventEmitter,
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionEventEmitter,
  ExtensionRequestHandler,
} from '@core/types';
import { RequestProcessorPipeline } from '../RequestProcessorPipeline';
import {
  connectionLog,
  disconnectLog,
  eventLog,
  responseLog,
  isDevelopment,
} from '@core/common';

import { resolve } from '@avalabs/core-utils-sdk';
import './registry';
import '../dAppConnection/registry';
import { deserializeFromJSON, serializeToJSON } from '@core/messaging';
import { Monitoring } from '@core/common';

import { DappHandlerToExtensionHandlerTransformer } from './DappHandlerToExtensionHandlerTransformer';
import { NetworkService } from '../../services/network/NetworkService';
import { ModuleManager } from '../../vmModules/ModuleManager';
import { ActiveNetworkMiddleware } from '../middlewares/ActiveNetworkMiddleware';
import { AvalancheTxContextMiddleware } from '../middlewares/AvalancheTxContextMiddleware';
import { Pipeline } from '../middlewares/models';
import { AccountsService } from '~/services/accounts/AccountsService';
import { SecretsService } from '~/services/secrets/SecretsService';

@injectable()
export class ExtensionConnectionController implements ConnectionController {
  private pipeline?: Pipeline<
    ExtensionConnectionMessage,
    ExtensionConnectionMessageResponse<any, any>
  >;
  private connection?: Runtime.Port;

  constructor(
    @injectAll('ExtensionRequestHandler')
    private handlers: ExtensionRequestHandler<any, any>[],
    @injectAll('ExtensionEventEmitter')
    private eventEmitters: ExtensionEventEmitter[],
    @injectAllWithTransform(
      'DAppRequestHandler',
      DappHandlerToExtensionHandlerTransformer,
    )
    private dappHandlers: ExtensionRequestHandler<any, any>[],
    @injectAll('DAppEventEmitter') private dappEmitters: DAppEventEmitter[],
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private secretsService: SecretsService,
    private moduleManager: ModuleManager,
  ) {
    this.onMessage = this.onMessage.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onEvent = this.onEvent.bind(this);
  }

  connect(connection: Runtime.Port) {
    this.connection = connection;

    this.pipeline = RequestProcessorPipeline(
      ActiveNetworkMiddleware(this.networkService),
      AvalancheTxContextMiddleware(this.accountsService, this.secretsService),
      ExtensionRequestHandlerMiddleware(
        [...this.handlers, ...this.dappHandlers],
        this.moduleManager,
      ),
    );

    connectionLog('Extension Provider');

    this.connection?.onMessage.addListener(this.onMessage);
    this.connection?.onDisconnect.addListener(this.disconnect);

    this.eventEmitters.forEach((emitter) => emitter.addListener(this.onEvent));
    this.dappEmitters.forEach((emitter) => {
      emitter.addListener(this.onEvent);
      emitter.setConnectionInfo({
        domain: new URL(connection?.sender?.url || '').hostname,
      });
    });
  }

  disconnect(): void {
    this.connection?.onMessage.removeListener(this.onMessage);
    this.eventEmitters.forEach((emitter) =>
      emitter.removeListener(this.onEvent),
    );
    this.dappEmitters.forEach((emitter) =>
      emitter.removeListener(this.onEvent),
    );
    disconnectLog('Extension Provider');
  }

  private async onMessage(requestJSON: string) {
    if (!this.pipeline || !this.connection) {
      throw Error('ExtensionConnectionController is not connected to a port');
    }

    const deserializedRequest =
      deserializeFromJSON<ExtensionConnectionMessage>(requestJSON);
    if (!deserializedRequest) {
      return;
    }

    const [context, error] = await resolve(
      this.pipeline.execute({
        // always start with authenticated false, middlewares take care of context updates
        authenticated: false,
        request: deserializedRequest,
        // Extension does not connect through ChainAgnosticProvider,
        // therefore its requests do not have domainMetadata populated.
        domainMetadata: {
          domain: runtime.id,
          url: runtime.getURL(''),
          tabId: deserializedRequest.params.request.tabId,
          icon: runtime.getManifest().icons?.['192'],
          name: runtime.getManifest().name,
        },
      }),
    );

    if (error) {
      const response = {
        ...deserializedRequest,
        data: {
          error,
        },
      };
      if (isDevelopment()) {
        responseLog(
          `extension reponse (${deserializedRequest.params.request.method})`,
          response,
        );
      }
      try {
        this.connection?.postMessage(serializeToJSON(response));
      } catch (e) {
        Monitoring.sentryCaptureException(
          e as Error,
          Monitoring.SentryExceptionTypes.EXTENSION_CONNECTION_MESSAGE,
        );
        console.error(e);
      }
    } else if (context) {
      if (isDevelopment()) {
        responseLog(
          `extension reponse (${deserializedRequest.params.request.method})`,
          context.response,
        );
      }

      const skipPosting =
        context.response === DEFERRED_RESPONSE ||
        context.response?.result === DEFERRED_RESPONSE;

      if (skipPosting) {
        return;
      }

      try {
        this.connection?.postMessage(serializeToJSON(context.response));
      } catch (e) {
        // This try statement could throw an exception when a connection is closed with this message: "Attempting to use a disconnected port object"
        // Since the UI which made this request is disconnected, this should be harmless.
        console.error(e);
      }
    }
  }

  private onEvent(evt: ExtensionConnectionEvent) {
    if (isDevelopment()) {
      eventLog(`extension event (${evt.name})`, evt);
    }
    try {
      this.connection?.postMessage(serializeToJSON(evt));
    } catch (e) {
      Monitoring.sentryCaptureException(
        e as Error,
        Monitoring.SentryExceptionTypes.EXTENSION_CONNECTION_EVENT,
      );
      console.error(e);
    }
  }
}
