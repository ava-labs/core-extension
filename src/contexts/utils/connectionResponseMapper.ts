import { deserializeFromJSON } from '@src/background/serialization/deserialize';
import { isDevelopment } from '@src/utils/environment';
import { requestLog, responseLog } from '@src/utils/logging';
import { firstValueFrom, Subject } from 'rxjs';
import { Runtime } from 'webextension-polyfill';
import {
  ExtensionConnectionMessageResponse,
  ExtensionConnectionMessage,
  isConnectionResponse,
  isConnectionEvent,
  ExtensionConnectionEvent,
} from '../../background/connections/models';
import { serializeToJSON } from '@src/background/serialization/serialize';

const responseMap = new Map<
  string,
  Subject<ExtensionConnectionMessageResponse>
>();

export function connectionRequest(request: ExtensionConnectionMessage) {
  const responseHandler = new Subject<ExtensionConnectionMessageResponse>();
  responseMap.set(request.id, responseHandler);
  return firstValueFrom(responseHandler);
}

export function connectionResponseHandler(
  eventHandler?: Subject<ExtensionConnectionEvent>
) {
  return (message: string) => {
    const deserializedMessage = deserializeFromJSON<
      ExtensionConnectionMessageResponse | ExtensionConnectionEvent
    >(message);
    if (deserializedMessage && isConnectionEvent(deserializedMessage)) {
      if (!eventHandler) return;
      eventHandler.next(deserializedMessage);
    } else if (
      deserializedMessage &&
      isConnectionResponse(deserializedMessage)
    ) {
      const responseHandler = responseMap.get(deserializedMessage.id);
      responseHandler?.next(deserializedMessage);
      responseMap.delete(deserializedMessage.id);
    }
  };
}

export function requestEngine(
  connection: Runtime.Port,
  eventHandler?: Subject<ExtensionConnectionEvent>
) {
  const connectionResponseHandlerInstance =
    connectionResponseHandler(eventHandler);
  connection.onMessage.addListener(connectionResponseHandlerInstance);

  connection.onDisconnect.addListener(function onRequestEngineDisconnect() {
    connection.onMessage.removeListener(connectionResponseHandlerInstance);
    connection.onDisconnect.removeListener(onRequestEngineDisconnect);
  });
  return async (request: Omit<ExtensionConnectionMessage, 'id'>) => {
    const requestWithId = {
      ...request,
      id: `${request.method}-${Math.floor(Math.random() * 10000000)}`,
    };
    const response = connectionRequest(requestWithId);
    isDevelopment() &&
      requestLog(`Extension Request  (${requestWithId.method})`, requestWithId);
    connection.postMessage(serializeToJSON(requestWithId));
    response.then((res) => {
      isDevelopment() && responseLog(`Extension Response (${res.method})`, res);
      return res;
    });
    return response;
  };
}
