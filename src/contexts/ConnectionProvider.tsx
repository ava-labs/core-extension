import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Observable, Subject } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { EXTENSION_SCRIPT } from '@src/common';
import { requestEngine } from '@src/contexts/utils/connectionResponseMapper';
import { LoadingIcon } from '@avalabs/react-components';

function request(engine: ReturnType<typeof requestEngine>) {
  return function requestHandler<T = any>(
    message: Omit<ExtensionConnectionMessage, 'id'>
  ) {
    return engine(message).then<T>((results) => {
      return results.error ? Promise.reject(results.error) : results.result;
    });
  };
}

const ConnectionContext = createContext<{
  request: ReturnType<typeof request>;
  events<V = any>(): Observable<ExtensionConnectionEvent<V>>;
  connection?: Runtime.Port;
}>({} as any);

export function ConnectionContextProvider({ children }: { children: any }) {
  const [connection, setConnection] = useState<Runtime.Port>();
  const [eventsHandler, setEventsHandler] = useState<Subject<any>>();

  useEffect(() => {
    function getAndSetNewConnection() {
      const newConnection: Runtime.Port = extension.runtime.connect({
        name: EXTENSION_SCRIPT,
      });
      newConnection.onDisconnect.addListener(() => {
        console.log('Reconnecting...');
        getAndSetNewConnection();
      });
      setConnection(newConnection);
    }

    if (!connection) {
      getAndSetNewConnection();
    }
    setEventsHandler(new Subject<ExtensionConnectionEvent>());
    // This is for initialization of states and needs to only run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const engine = useMemo(
    () => connection && requestEngine(connection, eventsHandler),
    [connection, eventsHandler]
  );

  if (!engine || !eventsHandler) {
    return <LoadingIcon />;
  }

  return (
    <ConnectionContext.Provider
      value={{
        connection,
        request: request(engine),
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
