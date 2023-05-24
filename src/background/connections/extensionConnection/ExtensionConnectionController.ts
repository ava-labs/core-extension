import { injectable, injectAll } from 'tsyringe';
import { Runtime } from 'webextension-polyfill-ts';
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
import { ExtensionRequestDeserializeMiddleware } from '../middlewares/ExtensionRequestDeserializeMiddleware';
import { ExtensionRequestSerializeMiddleware } from '../middlewares/ExtensionRequestSerializeMiddleware';
import { serialize } from '@src/background/serialization/serialize';

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
      ExtensionRequestDeserializeMiddleware(),
      ExtensionRequestHandlerMiddleware(this.handlers),
      ExtensionRequestSerializeMiddleware()
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

  private async onMessage(request: ExtensionConnectionMessage) {
    if (!this.pipeline || !this.connection) {
      throw Error('ExtensionConnectionController is not connected to a port');
    }

    const [context, error] = await resolve(
      this.pipeline.execute({
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
      if (isDevelopment()) {
        responseLog(`extension reponse (${request.method})`, response);
      }
      try {
        this.connection?.postMessage(response);
      } catch (e) {
        console.error(e);
      }
    } else if (context) {
      if (isDevelopment()) {
        responseLog(`extension reponse (${request.method})`, context.response);
      }
      try {
        this.connection?.postMessage(context.response);
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
      evt.value = serialize(evt.value);
      this.connection?.postMessage(evt);
    } catch (e) {
      console.error(e);
    }
  }
}
