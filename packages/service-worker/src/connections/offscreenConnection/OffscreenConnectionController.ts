import { injectable, injectAll } from 'tsyringe';
import { runtime, Runtime } from 'webextension-polyfill';
import { Pipeline } from '../middlewares/models';
import { ExtensionRequestHandlerMiddleware } from '../middlewares/ExtensionRequestHandlerMiddleware';
import {
  ConnectionController,
  DEFERRED_RESPONSE,
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
  OffscreenEventEmitter,
} from '@core/types';
import { RequestProcessorPipeline } from '../RequestProcessorPipeline';
import {
  connectionLog,
  disconnectLog,
  eventLog,
  responseLog,
  isDevelopment,
} from '@core/common';
import './registry';

import { resolve } from '@avalabs/core-utils-sdk';
import { serializeToJSON, deserializeFromJSON } from '@core/messaging';
import { Monitoring } from '@core/common';
import { ModuleManager } from '../../vmModules/ModuleManager';

@injectable()
export class OffscreenConnectionController implements ConnectionController {
  private pipeline?: Pipeline<
    ExtensionConnectionMessage,
    ExtensionConnectionMessageResponse<any, any>
  >;
  private connection?: Runtime.Port;

  constructor(
    @injectAll('OffscreenRequestHandler')
    private handlers: ExtensionRequestHandler<any, any>[],
    @injectAll('OffscreenEventEmitter')
    private eventEmitters: OffscreenEventEmitter[],
    private moduleManager: ModuleManager,
  ) {
    this.onMessage = this.onMessage.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onEvent = this.onEvent.bind(this);
  }

  connect(connection: Runtime.Port) {
    this.connection = connection;

    this.pipeline = RequestProcessorPipeline(
      ExtensionRequestHandlerMiddleware([...this.handlers], this.moduleManager),
    );

    connectionLog('Offscreen Connection Provider');

    this.connection?.onMessage.addListener(this.onMessage);

    this.connection?.onDisconnect.addListener(this.disconnect);

    this.eventEmitters.forEach((emitter) => emitter.addListener(this.onEvent));
  }

  disconnect(): void {
    this.connection?.onMessage.removeListener(this.onMessage);
    this.eventEmitters.forEach((emitter) =>
      emitter.removeListener(this.onEvent),
    );
    disconnectLog('Offscreen Provider');
  }

  private async hasOffscreenDocument(filename: string) {
    if ('getContexts' in chrome.runtime) {
      const id = chrome.runtime.id;
      const contexts = await chrome.runtime.getContexts({
        documentUrls: [`chrome-extension://${id}/${filename}`],
      });
      return !!contexts.length;
    }
    return false;
  }

  async sendMessage(message: string) {
    const hasOffscreenDocument = await this.hasOffscreenDocument(
      'offscreen/offscreen.html',
    );
    if (!hasOffscreenDocument) {
      throw new Error(
        'OffscreenConnectionController is not connected to an offscreen document',
      );
    }
    this.connection?.postMessage(message);
  }

  private async onMessage(requestJSON: string) {
    if (!this.pipeline || !this.connection) {
      throw Error('OffscreenConnectionController is not connected to a port');
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

  private async onEvent(evt: ExtensionConnectionEvent) {
    const hasOffscreenDocument = await this.hasOffscreenDocument(
      'offscreen/offscreen.html',
    );

    if (!hasOffscreenDocument) {
      throw new Error(
        'OffscreenConnectionController is not connected to an offscreen document',
      );
    }
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
