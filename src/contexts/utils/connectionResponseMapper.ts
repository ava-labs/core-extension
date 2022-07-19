import { deserialize } from '@src/background/serialization/deserialize';
import { serialize } from '@src/background/serialization/serialize';
import { isDevelopment } from '@src/utils/environment';
import { requestLog, responseLog } from '@src/utils/logging';
import { firstValueFrom, Subject } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import {
  ExtensionConnectionMessageResponse,
  ExtensionConnectionMessage,
  isConnectionResponse,
  isConnectionEvent,
  ExtensionConnectionEvent,
} from '../../background/connections/models';

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
  return (
    message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
  ) => {
    if (isConnectionEvent(message)) {
      if (!eventHandler) return;
      message.value = deserialize(message.value);
      eventHandler.next(message);
    } else if (isConnectionResponse(message)) {
      const responseHandler = responseMap.get(message.id);
      responseHandler?.next(message);
      responseMap.delete(message.id);
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
    requestWithId.params = serialize(requestWithId.params);
    const response = connectionRequest(requestWithId);
    isDevelopment() && requestLog('Extension Request', requestWithId);
    connection.postMessage(requestWithId);
    response.then((res) => {
      isDevelopment() && responseLog('Extension Response', res);
      res.result = deserialize(res.result);
      return res;
    });
    return response;
  };
}
