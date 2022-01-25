import { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/models';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { resolve } from '@src/utils/promiseResolver';
import { filter } from 'rxjs';
import { LedgerEvent } from '@src/background/services/ledger/events/models';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';

export const SUPPORTED_LEDGER_VERSION = '0.5.9';

const LedgerSupportContext = createContext<{
  popDeviceSelection(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  initLedgerTransport(): Promise<void>;
  hasLedgerTransport: boolean;
}>({} as any);

export function LedgerSupportContextProvider({ children }: { children: any }) {
  const [hasLedgerTransport, setHasLedgerTransport] = useState(false);
  const { request, events } = useConnectionContext();

  useEffect(() => {
    events &&
      events()
        .pipe(filter((evt) => evt.name === LedgerEvent.HAS_TRANSPORT))
        .subscribe((res) => {
          setHasLedgerTransport(!!res.value);
        });
  }, [events]);

  /**
   *
   * @returns Promise<public key>
   */
  function getPublicKey() {
    return request({
      method: ExtensionRequest.LEDGER_GET_PUBLIC,
      params: [],
    });
  }

  /**
   * When the user plugs-in/connects their ledger for the first time a
   * device selection needs to be performed before we can do anything with
   * the device. So for those cases this function forces that popup to open.
   *
   * This cannot be opened on the popup (confirm) or popout (extension click)
   * view. This can only be performed on a tab view so the user will need to be
   * put into that state first.
   *
   * @returns The transport object
   */
  async function popDeviceSelection() {
    if (hasLedgerTransport) {
      return true;
    }
    const [hidTransport] = await resolve(TransportWebHID.request());
    if (hidTransport) {
      // if connection was successfull immeditately close it to let the background script create the connection
      await hidTransport.close();
      return true;
    }
    const [usbTransport] = await resolve(TransportWebUSB.request());
    if (usbTransport) {
      // if connection was successfull immeditately close it to let the background script create the connection
      await usbTransport.close();
      return true;
    }
    const [u2fTransport] = await resolve(TransportU2F.create());
    if (u2fTransport) {
      // if connection was successfull immeditately close it to let the background script create the connection
      await u2fTransport.close();
      return true;
    }

    throw Error('Ledger device selection failed');
  }

  async function initLedgerTransport() {
    await request({
      method: ExtensionRequest.LEDGER_INIT_TRANSPORT,
      params: [],
    });
  }

  if (!request || !events) {
    return <LoadingIcon />;
  }

  return (
    <LedgerSupportContext.Provider
      value={{
        popDeviceSelection,
        getPublicKey,
        initLedgerTransport,
        hasLedgerTransport,
      }}
    >
      {children}
    </LedgerSupportContext.Provider>
  );
}

export function useLedgerSupportContext() {
  return useContext(LedgerSupportContext);
}
