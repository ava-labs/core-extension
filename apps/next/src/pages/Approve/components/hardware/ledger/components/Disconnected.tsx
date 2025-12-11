import { FC, useCallback } from 'react';
import { Button } from '@avalabs/k2-alpine';
import { tabs } from 'webextension-polyfill';
import { useTranslation } from 'react-i18next';

import { ContextContainer } from '@core/types';
import { isSpecificContextContainer, useLedgerContext } from '@core/ui';

import { StateComponentProps } from '../types';
import { ErrorState } from './ErrorState';

export const Disconnected: FC<StateComponentProps> = ({ state }) => {
  const { t } = useTranslation();
  const { popDeviceSelection, initLedgerTransport } = useLedgerContext();

  const onReconnect = useCallback(async () => {
    if (isSpecificContextContainer(ContextContainer.CONFIRM)) {
      popDeviceSelection();
    } else {
      // Open in a full screen tab, the extension window does not support the device selection popup.
      const tab = await tabs.create({
        url: '/fullscreen.html#/ledger/reconnect',
      });

      const initTransport = (tabId) => {
        if (tabId === tab.id) {
          initLedgerTransport();
        }

        tabs.onRemoved.removeListener(initTransport);
      };

      tabs.onRemoved.addListener(initTransport);
    }
  }, [popDeviceSelection, initLedgerTransport]);

  if (state.state !== 'disconnected') {
    return null;
  }

  return (
    <ErrorState
      title={t('Ledger disconnected')}
      description={t(
        'Reconnect your Ledger device and open the {{appName}} app to continue',
        { appName: state.requiredApp ?? 'Avalanche' },
      )}
      action={
        <Button
          variant="contained"
          color="primary"
          size="extension"
          onClick={onReconnect}
        >
          {t('Unable to connect?')}
        </Button>
      }
    />
  );
};
