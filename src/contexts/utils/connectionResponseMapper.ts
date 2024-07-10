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
import {
  JsonRpcRequest,
  JsonRpcRequestPayload,
} from '@src/background/connections/dAppConnection/models';
import { PartialBy } from '@src/background/models';

const responseMap = new Map<
  string,
  Subject<ExtensionConnectionMessageResponse>
>();

const sessionId = crypto.randomUUID();

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
  return async (
    request: PartialBy<Omit<JsonRpcRequestPayload, 'id'>, 'params'>,
    scope: string
  ) => {
    const id = `${request.method}-${Math.floor(Math.random() * 10000000)}`;

    const requestWithId: JsonRpcRequest = {
      id,
      jsonrpc: '2.0',
      method: 'provider_request',
      params: {
        sessionId,
        scope,
        request: {
          id,
          params: [],
          ...request,
        },
      },
    };
    const response = connectionRequest(requestWithId);
    isDevelopment() &&
      requestLog(
        `Extension Request  (${requestWithId.params.request.method})`,
        requestWithId
      );
    connection.postMessage(serializeToJSON(requestWithId));
    response.then((res) => {
      isDevelopment() && responseLog(`Extension Response (${res.method})`, res);
      return res;
    });
    return response;
  };
}
