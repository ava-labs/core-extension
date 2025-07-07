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
import { getKeystoneTransport } from './utils/keystoneHelper';
import { resolve } from '@core/common';
import { fromPublicKey } from 'bip32';
import Avalanche, { ChainIDAlias } from '@keystonehq/hw-app-avalanche';

interface KeystoneContextType {
  initKeystoneTransport: () => Promise<void>;
  popDeviceSelection: () => Promise<boolean>;
  getExtendedPublicKey: (chainType?: ChainIDAlias) => Promise<string>;
  wasTransportAttempted: boolean;
  getMasterFingerprint: () => Promise<string>;
  hasKeystoneTransport: boolean;
}

const KeystoneContext = createContext<KeystoneContextType>({} as any);

export function KeystoneUsbContextProvider({ children }: { children: any }) {
  const [initialized, setInitialized] = useState(false);
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
        }),
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, request]);

  const initKeystoneTransport = useCallback(async () => {
    setInitialized(true);
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

  const getMasterFingerprint = async () => {
    if (!avalancheAppRef.current) {
      throw new Error('no device detected');
    }

    return (await avalancheAppRef.current.getAppConfig()).mfp ?? '';
  };

  return (
    <KeystoneContext.Provider
      value={{
        initKeystoneTransport,
        popDeviceSelection,
        getExtendedPublicKey,
        wasTransportAttempted,
        getMasterFingerprint,
        hasKeystoneTransport: !!avalancheAppRef.current,
      }}
    >
      {children}
    </KeystoneContext.Provider>
  );
}

export function useKeystoneUsbContext() {
  return useContext(KeystoneContext);
}
