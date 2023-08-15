import {
  ExtensionConnectionEvent,
  RequestHandlerType,
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
import { Signal, ValueCache } from 'micro-signals';
import { LoadingContent } from '@src/popup/LoadingContent';

const requestEngineCache = new ValueCache<ReturnType<typeof requestEngine>>();
const requestEngineSignal = new Signal<ReturnType<typeof requestEngine>>();
const activeRequestEngine = requestEngineSignal
  .cache(requestEngineCache)
  .filter((value) => !!value)
  .readOnly();
const eventsHandler = new Subject<ExtensionConnectionEvent>();
const tabId = Math.floor(Math.random() * 100000000);

export interface ConnectionContextType {
  /**
   * Make a call to the background service worker.
   * The `Handler` type argument is required and must be a reference to a class
   * that implements `ExtensionRequestHandler`.
   */
  request: RequestHandlerType;
  events<V = any>(): Observable<ExtensionConnectionEvent<V>>;
  connection?: Runtime.Port;
  tabId: number;
}

const ConnectionContext = createContext<ConnectionContextType>({} as any);

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
    async function requestHandler(message) {
      const activeEngine = await activeRequestEngine.promisify();

      return activeEngine({ ...message, tabId }).then<any>((results) => {
        return results.error ? Promise.reject(results.error) : results.result;
      });
    },
    []
  );

  const events = useCallback(() => eventsHandler.asObservable(), []);

  if (!connection) {
    return <LoadingContent />;
  }

  return (
    <ConnectionContext.Provider
      value={{
        connection,
        request: requestHandler,
        events,
        tabId,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnectionContext() {
  return useContext(ConnectionContext);
}
