import {
  ExtensionConnectionEvent,
  ExtensionConnectionMessage,
} from '@src/background/connections/models';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Observable, Subject } from 'rxjs';
import { Runtime } from 'webextension-polyfill-ts';
import extension from 'extensionizer';
import { EXTENSION_SCRIPT } from '@src/common';
import { requestEngine } from '@src/contexts/utils/connectionResponseMapper';
import { LoadingIcon } from '@avalabs/react-components';
import { Signal, ValueCache } from 'micro-signals';

const requestEngineCache = new ValueCache<ReturnType<typeof requestEngine>>();
const requestEngineSignal = new Signal<ReturnType<typeof requestEngine>>();
const activeRequestEngine = requestEngineSignal
  .cache(requestEngineCache)
  .filter((value) => !!value)
  .readOnly();
const eventsHandler = new Subject<ExtensionConnectionEvent>();

type RequestHandlerType = <T = any>(
  message: Omit<ExtensionConnectionMessage, 'id'>
) => Promise<T>;

const ConnectionContext = createContext<{
  request: RequestHandlerType;
  events<V = any>(): Observable<ExtensionConnectionEvent<V>>;
  connection?: Runtime.Port;
}>({} as any);

export function ConnectionContextProvider({ children }: { children: any }) {
  const [connection, setConnection] = useState<Runtime.Port>();

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
      requestEngineSignal.dispatch(requestEngine(newConnection, eventsHandler));
    }

    getAndSetNewConnection();
  }, []);

  const requestHandler: RequestHandlerType = useCallback(
    async function requestHandler<T = any>(
      message: Omit<ExtensionConnectionMessage, 'id'>
    ) {
      const activeEngine = await activeRequestEngine.promisify();
      return activeEngine(message).then<T>((results) => {
        return results.error ? Promise.reject(results.error) : results.result;
      });
    },
    []
  );

  const events = useCallback(() => eventsHandler.asObservable(), []);

  if (!connection) {
    return <LoadingIcon />;
  }

  return (
    <ConnectionContext.Provider
      value={{
        connection,
        request: requestHandler,
        events,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionContext() {
  return useContext(ConnectionContext);
}
