import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { Observable, Subject, tap } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { EXTENSION_SCRIPT } from '@src/common';
import { requestEngine } from '@src/background/connections/connectionResponseMapper';
import { LoadingIcon } from '@avalabs/react-components';

function request(connection: Runtime.Port, eventsHandler) {
  return function requestHandler<T = any>(
    message: Omit<ExtensionConnectionMessage, 'id'>
  ) {
    return requestEngine(
      connection!,
      eventsHandler
    )(message).then<T>((results) =>
      results.error ? Promise.reject(results.error) : results.result
    );
  };
}

const ConnectionContext = createContext<{
  request: ReturnType<typeof request>;
  events?<V = any>(): Observable<ExtensionConnectionEvent<V>>;
  connection?: Runtime.Port;
}>({} as any);

export function ConnectionContextProvider({ children }: { children: any }) {
  const [connection, setConnection] = useState<Runtime.Port>();
  const [eventsHandler, setEventsHandler] = useState<Subject<any>>();

  useEffect(() => {
    const connection: Runtime.Port = extension.runtime.connect({
      name: EXTENSION_SCRIPT,
    });

    setEventsHandler(new Subject<ExtensionConnectionEvent>());
    setConnection(connection);
  }, []);

  if (!connection || !eventsHandler) {
    return <LoadingIcon />;
  }

  return (
    <ConnectionContext.Provider
      value={{
        connection,
        request: request(connection, eventsHandler),
        events: () => eventsHandler.asObservable(),
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionContext() {
  return useContext(ConnectionContext);
}
