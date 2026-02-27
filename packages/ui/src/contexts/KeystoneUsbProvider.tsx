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

const isWebUsbUserCancelError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === 'NotFoundError';

interface KeystoneContextType {
  initKeystoneTransport: () => Promise<void>;
  retryConnection: () => Promise<void>;
  popDeviceSelection: () => Promise<boolean>;
  getExtendedPublicKey: (
    chainType: ChainIDAlias,
    index: number,
  ) => Promise<string>;
  wasTransportAttempted: boolean;
  userCancelledDeviceSelection: boolean;
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
  const [userCancelledDeviceSelection, setUserCancelledDeviceSelection] =
    useState(false);

  useEffect(() => {
    const subscription = of([initialized])
      .pipe(
        filter(([isInitialized]) => !!isInitialized),
        switchMap(async () => {
          // Get transport directly (not via resolve()) so the original error
          // is preserved for retryWhen to distinguish user cancellation from
          // transient failures.
          let usbTransport: TransportWebUSB;

          try {
            usbTransport = await createKeystoneTransport();
          } catch (err) {
            setWasTransportAttempted(true);
            setHasKeystoneTransport(false);
            throw err;
          }

          transportRef.current = usbTransport;
          const app = new Avalanche(usbTransport);

          // Verify the device is accessible (not just locked).
          // If this fails, the device might be locked but transport still exists.
          try {
            await app.getAppConfig();
          } catch (_error) {
            throw new Error('Keystone device locked or unavailable');
          }

          return app;
        }),
        tap((app) => {
          avalancheAppRef.current = app as Avalanche;
          setHasKeystoneTransport(true);
          setWasTransportAttempted(true);
          setUserCancelledDeviceSelection(false);
        }),
        // Retry transient errors (e.g. device locked) but stop immediately
        // if the user cancelled the WebUSB device picker.
        retryWhen((errors) => {
          return errors.pipe(
            tap((err) => {
              if (isWebUsbUserCancelError(err)) {
                throw err;
              }
              setWasTransportAttempted(true);
              setHasKeystoneTransport(false);
            }),
            delay(2000),
          );
        }),
      )
      .subscribe({
        error: (err) => {
          // Only clear app reference; transport ref may still be valid
          // for locked devices.
          avalancheAppRef.current = null;
          setWasTransportAttempted(true);
          setHasKeystoneTransport(false);

          if (isWebUsbUserCancelError(err)) {
            setUserCancelledDeviceSelection(true);
          }
        },
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, request]);

  const initKeystoneTransport = useCallback(async () => {
    // If we already have a connected app, verify it's still valid and set state
    // immediately so the overlay doesn't flash 'loading' when already connected.
    if (avalancheAppRef.current) {
      try {
        await avalancheAppRef.current.getAppConfig();
        setHasKeystoneTransport(true);
        setWasTransportAttempted(true);
        return;
      } catch {
        // Connection is stale — clear references and let the stream reconnect.
        avalancheAppRef.current = null;
        transportRef.current = null;
        setHasKeystoneTransport(false);
        setWasTransportAttempted(true);
      }
    }
    // Reset cancellation flag since this is an explicit user-initiated connection.
    setUserCancelledDeviceSelection(false);
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

  const getExtendedPublicKey = useCallback(
    async (chainType: ChainIDAlias, index: number) => {
      if (!avalancheAppRef.current) {
        throw new Error('no device detected');
      }

      if (chainType === ChainIDAlias.C) {
        const { publicKey, chainCode } =
          await avalancheAppRef.current.getExtendedPublicKey(chainType);
        return fromPublicKey(
          Buffer.from(publicKey, 'hex'),
          chainCode,
        ).toBase58();
      }
      const { publicKey, chainCode } = await avalancheAppRef.current.getPubkey(
        getAvalancheExtendedKeyPath(index),
        Curve.secp256k1,
        DerivationAlgorithm.slip10,
      );
      return fromPublicKey(Buffer.from(publicKey, 'hex'), chainCode).toBase58();
    },
    [],
  );

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
        userCancelledDeviceSelection,
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
