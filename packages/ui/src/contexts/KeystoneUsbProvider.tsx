import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { delay, filter, of, retryWhen, switchMap, tap } from 'rxjs';
import {
  createKeystoneTransport,
  TransportWebUSB,
} from '@keystonehq/hw-transport-webusb';
import { useConnectionContext } from './ConnectionProvider';
import { getAvalancheExtendedKeyPath, resolve } from '@core/common';
import { fromPublicKey } from 'bip32';
import Avalanche, { ChainIDAlias } from '@keystonehq/hw-app-avalanche';
import { Curve, DerivationAlgorithm } from '@keystonehq/bc-ur-registry';

interface KeystoneContextType {
  initKeystoneTransport: () => Promise<void>;
  retryConnection: () => Promise<void>;
  popDeviceSelection: () => Promise<boolean>;
  getExtendedPublicKey: (
    chainType: ChainIDAlias,
    index: number,
  ) => Promise<string>;
  wasTransportAttempted: boolean;
  getMasterFingerprint: () => Promise<string>;
  hasKeystoneTransport: boolean;
}

const KeystoneContext = createContext<KeystoneContextType>({} as any);

export function KeystoneUsbContextProvider({ children }: { children: any }) {
  const [initialized, setInitialized] = useState(false);
  const { request } = useConnectionContext();
  const avalancheAppRef = useRef<Avalanche | null>(null);
  const transportRef = useRef<TransportWebUSB | null>(null);
  const [wasTransportAttempted, setWasTransportAttempted] = useState(false);
  const [hasKeystoneTransport, setHasKeystoneTransport] = useState(false);

  useEffect(() => {
    const subscription = of([initialized])
      .pipe(
        filter(([isInitialized]) => !!isInitialized),
        switchMap(async () => {
          // Get transport directly to store reference
          const [usbTransport] = await resolve(createKeystoneTransport());
          if (!usbTransport) {
            setWasTransportAttempted(true);
            setHasKeystoneTransport(false);
            throw new Error('Keystone transport not available');
          }
          transportRef.current = usbTransport;
          const app = new Avalanche(usbTransport);
          // Try to verify the device is accessible (not just locked)
          // If this fails, the device might be locked, but transport still exists
          try {
            await app.getAppConfig();
          } catch (_error) {
            // Device might be locked - keep transport but don't set hasKeystoneTransport yet
            // This allows retry to work for locked devices
            throw new Error('Keystone device locked or unavailable');
          }
          return app;
        }),
        tap((app) => {
          avalancheAppRef.current = app as Avalanche;
          setHasKeystoneTransport(true);
          setWasTransportAttempted(true);
        }),
        retryWhen((errors) => {
          // Don't clear transport reference on retry - device might just be locked
          // Only update state to show disconnected, but keep transport for retry
          setWasTransportAttempted(true);
          setHasKeystoneTransport(false);
          return errors.pipe(delay(2000));
        }),
      )
      .subscribe({
        error: () => {
          // Ensure wasTransportAttempted is set even on final error
          // Don't clear transport reference here - it might still be valid for locked devices
          // Only clear app reference, transport will be reused on retry
          avalancheAppRef.current = null;
          setWasTransportAttempted(true);
          setHasKeystoneTransport(false);
        },
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, request]);

  const initKeystoneTransport = useCallback(async () => {
    // If we already have a connected app, verify it's still valid and set state immediately
    // This prevents the overlay from showing 'loading' when device is already connected
    if (avalancheAppRef.current) {
      try {
        await avalancheAppRef.current.getAppConfig();
        setHasKeystoneTransport(true);
        setWasTransportAttempted(true);
        // Don't trigger stream if already connected - state is already set
        return;
      } catch {
        // Connection is stale, clear it and let the stream reconnect
        avalancheAppRef.current = null;
        transportRef.current = null;
        setHasKeystoneTransport(false);
        setWasTransportAttempted(true);
      }
    }
    // Trigger stream to check connection
    setInitialized(true);
  }, []);

  const retryConnection = useCallback(async () => {
    // Retry connection without resetting wasTransportAttempted to avoid flashing
    // Clear the app and transport references and reset initialized to trigger a fresh connection attempt
    avalancheAppRef.current = null;
    transportRef.current = null;
    setHasKeystoneTransport(false);
    setInitialized(false);
    // Small delay to ensure state reset, then reinitialize
    setTimeout(() => setInitialized(true), 100);
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

  const getExtendedPublicKey = async (
    chainType: ChainIDAlias,
    index: number,
  ) => {
    if (!avalancheAppRef.current) {
      throw new Error('no device detected');
    }

    if (chainType === ChainIDAlias.C) {
      const { publicKey, chainCode } =
        await avalancheAppRef.current.getExtendedPublicKey(chainType);
      return fromPublicKey(Buffer.from(publicKey, 'hex'), chainCode).toBase58();
    }
    const { publicKey, chainCode } = await avalancheAppRef.current.getPubkey(
      getAvalancheExtendedKeyPath(index),
      Curve.secp256k1,
      DerivationAlgorithm.slip10,
    );
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
        retryConnection,
        popDeviceSelection,
        getExtendedPublicKey,
        wasTransportAttempted,
        getMasterFingerprint,
        hasKeystoneTransport,
      }}
    >
      {children}
    </KeystoneContext.Provider>
  );
}

export function useKeystoneUsbContext() {
  return useContext(KeystoneContext);
}
