import { injectable, injectAll } from 'tsyringe';
import { Runtime } from 'webextension-polyfill';
import { Pipeline } from '../middlewares/models';
import { ExtensionRequestHandlerMiddleware } from '../middlewares/ExtensionRequestHandlerMiddleware';
import {
  ConnectionController,
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionEventEmitter,
  ExtensionRequestHandler,
} from '../models';
import { RequestProcessorPipeline } from '../RequestProcessorPipeline';
import {
  connectionLog,
  disconnectLog,
  eventLog,
  responseLog,
} from '@src/utils/logging';
import { resolve } from '@avalabs/utils-sdk';
import { isDevelopment } from '@src/utils/environment';
import './registry';
import { serializeToJSON } from '@src/background/serialization/serialize';
import { deserializeFromJSON } from '@src/background/serialization/deserialize';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';

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
    private eventEmitters: ExtensionEventEmitter[]
  ) {
    this.onMessage = this.onMessage.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.onEvent = this.onEvent.bind(this);
  }

  connect(connection: Runtime.Port) {
    this.connection = connection;
    this.pipeline = RequestProcessorPipeline(
      ExtensionRequestHandlerMiddleware(this.handlers)
    );

    connectionLog('Extension Provider');

    this.connection?.onMessage.addListener(this.onMessage);
    this.connection?.onDisconnect.addListener(this.disconnect);
    this.eventEmitters.forEach((emitter) => emitter.addListener(this.onEvent));
  }

  disconnect(): void {
    this.connection?.onMessage.removeListener(this.onMessage);
    this.eventEmitters.forEach((emitter) =>
      emitter.removeListener(this.onEvent)
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
      })
    );

    if (error) {
      const response = {
        ...deserializedRequest,
        data: {
          ...deserializedRequest.data,
          ...{ error },
        },
      };
      if (isDevelopment()) {
        responseLog(
          `extension reponse (${deserializedRequest.method})`,
          response
        );
      }
      try {
        this.connection?.postMessage(serializeToJSON(response));
      } catch (e) {
        sentryCaptureException(
          e as Error,
          SentryExceptionTypes.EXTENSION_CONNECTION_MESSAGE
        );
        console.error(e);
      }
    } else if (context) {
      if (isDevelopment()) {
        responseLog(
          `extension reponse (${deserializedRequest.method})`,
          context.response
        );
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
      sentryCaptureException(
        e as Error,
        SentryExceptionTypes.EXTENSION_CONNECTION_EVENT
      );
      console.error(e);
    }
  }
}
