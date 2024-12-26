import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { delay, filter, of, retryWhen, switchMap, tap } from 'rxjs';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';
import { useConnectionContext } from './ConnectionProvider';
import { getKeystoneTransport } from '@src/contexts/utils/keystoneHelper';
import { resolve } from '@src/utils/promiseResolver';
import { fromPublicKey } from 'bip32';
import Avalanche, { ChainIDAlias } from '@keystonehq/hw-app-avalanche';

export enum KeystoneAppType {
  AVALANCHE = 'Avalanche',
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  UNKNOWN = 'UNKNOWN',
}

const KeystoneContext = createContext<any>({} as any);

export function KeystoneUsbContextProvider({ children }: { children: any }) {
  const [initialized, setInialized] = useState(false);
  const { request } = useConnectionContext();
  const avalancheAppRef = useRef<Avalanche | null>(null);
  const [wasTransportAttempted, setWasTransportAttempted] = useState(false);

  useEffect(() => {
    const subscription = of([initialized])
      .pipe(
        filter(([isInitialized]) => !!isInitialized),
        switchMap(() => getKeystoneTransport()),
        tap((app) => {
          avalancheAppRef.current = app as Avalanche;
        }),
        tap(() => {
          setWasTransportAttempted(true);
        }),
        retryWhen((errors) => {
          setWasTransportAttempted(true);
          return errors.pipe(delay(2000));
        })
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, request]);

  const initKeystoneTransport = useCallback(async () => {
    setInialized(true);
  }, []);

  const popDeviceSelection = useCallback(async () => {
    if (avalancheAppRef.current) {
      return true;
    }
    const [usbTransport] = await resolve(createKeystoneTransport());
    if (usbTransport) {
      return true;
    }

    throw Error('Keystone device selection failed');
  }, [avalancheAppRef]);

  const getExtendedPublicKey = async (chainType?: ChainIDAlias) => {
    if (!avalancheAppRef.current) {
      throw new Error('no device detected');
    }

    const { publicKey, chainCode } =
      await avalancheAppRef.current.getExtendedPublicKey(chainType);
    return fromPublicKey(Buffer.from(publicKey, 'hex'), chainCode).toBase58();
  };

  return (
    <KeystoneContext.Provider
      value={{
        initKeystoneTransport,
        popDeviceSelection,
        getExtendedPublicKey,
        wasTransportAttempted,
        hasKeystoneTransport: !!avalancheAppRef.current,
      }}
    >
      {children}
    </KeystoneContext.Provider>
  );
}

export function useKeystoneContext() {
  return useContext(KeystoneContext);
}
