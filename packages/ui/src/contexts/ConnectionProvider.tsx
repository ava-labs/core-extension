import { ExtensionConnectionEvent, RequestHandlerType } from '@core/types';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  use,
  useEffect,
  useState,
} from 'react';
import { Observable, Subject } from 'rxjs';
import browser, { Runtime } from 'webextension-polyfill';
import { EXTENSION_SCRIPT } from '@core/common';
import { Signal, ValueCache } from 'micro-signals';
import { requestEngine } from './utils/connectionResponseMapper';
import { networkChanges } from './NetworkProvider';

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

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined,
);

export function ConnectionContextProvider({
  children,
  LoadingComponent,
}: PropsWithChildren<{ LoadingComponent: React.FC }>) {
  const [connection, setConnection] = useState<Runtime.Port>();

  useEffect(() => {
    function getAndSetNewConnection() {
      const newConnection: Runtime.Port = browser.runtime.connect({
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
    async function requestHandler(message, context) {
      const activeEngine = await activeRequestEngine.promisify();
      const scope = await networkChanges.promisify();

      return activeEngine(
        {
          ...message,
          tabId,
        },
        scope ?? '',
        {
          ...context,
          tabId,
        },
      ).then<any>((results) => {
        return results.error ? Promise.reject(results.error) : results.result;
      });
    },
    [],
  );

  const events = useCallback(() => eventsHandler.asObservable(), []);

  if (!connection) {
    return <LoadingComponent />;
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
  const context = use(ConnectionContext);
  if (!context) {
    throw new Error(
      'useConnectionContext must be used within a ConnectionContextProvider',
    );
  }
  return context;
}
