export interface ExtensionConnectionMessage {
  id: string;
  method: string;
  params?: any[];
}

export interface ExtensionConnectionMessageResponse<T = any>
  extends ExtensionConnectionMessage {
  result?: T;
  error?: Error;
}

export interface ExtensionConnectionEvent<V = any> {
  name: string;
  value: V;
}

export function isConnectionEvent(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
): message is ExtensionConnectionEvent {
  return (
    !message.hasOwnProperty('id') &&
    message.hasOwnProperty('name') &&
    message.hasOwnProperty('value')
  );
}

export function isConnectionResponse(
  message: ExtensionConnectionMessageResponse | ExtensionConnectionEvent
): message is ExtensionConnectionMessageResponse {
  return (
    message.hasOwnProperty('id') &&
    !message.hasOwnProperty('name') &&
    !message.hasOwnProperty('value')
  );
}
