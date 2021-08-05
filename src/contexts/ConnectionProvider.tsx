import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
} from '@src/background/connections/models';
import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { Observable, Subject } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { EXTENSION_SCRIPT } from '@src/common';
import { requestEngine } from '@src/background/connections/connectionResponseMapper';
import { LoadingIcon } from '@avalabs/react-components';

const ConnectionContext = createContext<{
  request?<T = any>(
    msg: Omit<ExtensionConnectionMessage, 'id'>
  ): Promise<ExtensionConnectionMessageResponse<T>>;
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
        request: requestEngine(connection, eventsHandler),
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
