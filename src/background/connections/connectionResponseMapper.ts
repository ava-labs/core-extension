import { firstValueFrom, Subject } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import {
  ExtensionConnectionMessageResponse,
  ExtensionConnectionMessage,
  isConnectionResponse,
  isConnectionEvent,
  ExtensionConnectionEvent,
} from './models';

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
      eventHandler && eventHandler.next(message);
    } else if (isConnectionResponse(message)) {
      const responseHandler = responseMap.get(message.id);
      responseHandler?.next(message.result);
      responseMap.delete(message.id);
    }
  };
}

export function requestEngine(
  connection: Runtime.Port,
  eventHandler?: Subject<ExtensionConnectionEvent>
) {
  connection.onMessage.addListener(connectionResponseHandler(eventHandler));
  connection.onDisconnect.addListener(function onRequestEngineDisconnect() {
    connection.onMessage.removeListener(connectionResponseHandler);
    connection.onDisconnect.removeListener(onRequestEngineDisconnect);
  });
  return (request: Omit<ExtensionConnectionMessage, 'id'>) => {
    const requestWithId = {
      ...request,
      id: `${request.method}-${Math.floor(Math.random() * 10000000)}`,
    };
    const response = connectionRequest(requestWithId);
    connection.postMessage(requestWithId);
    return response;
  };
}
