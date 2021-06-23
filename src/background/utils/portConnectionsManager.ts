import { Duplex } from "stream";
import { Runtime } from "webextension-polyfill-ts";

/**
 * We want to make sure that no port pair is ever connected to more than once.
 */
const connections = new Map<string, Runtime.Port>();

function getConnectionKey(sender?: Runtime.MessageSender) {
  return `${sender?.id}-${sender && sender["origin"]}`;
}

export function connectionExists(connection: Runtime.Port) {
  return connections.has(getConnectionKey(connection.sender));
}

export function addConnection(connection: any) {
  return connections.set(getConnectionKey(connection.sender), connection);
}

export function removeConnection(connection: any) {
  const con = connections.get(getConnectionKey(connection.sender));
  connections.delete(getConnectionKey(connection.sender));
  return con;
}
