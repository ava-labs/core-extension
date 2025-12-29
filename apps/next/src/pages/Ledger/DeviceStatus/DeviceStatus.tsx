import { Card } from '@/components/Card';
import { Page } from '@/components/Page';
import { ListItem, StackProps } from '@avalabs/k2-alpine';
import { useIsCorrectDeviceForActiveWallet, useLedgerContext } from '@core/ui';
import { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Connected,
  Connecting,
  ConnectionState,
  Disconnected,
  IncorrectDeviceConnected,
  ListItemBody3Text,
} from './components';
import { AvalancheAppNote } from './components/AvalancheAppNote';
import { State } from './types';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  height: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

const stateToComponent: Record<State, ComponentType> = {
  connecting: Connecting,
  connected: Connected,
  disconnected: Disconnected,
  incorrect: IncorrectDeviceConnected,
};

export const LedgerDeviceStatus = () => {
  const { t } = useTranslation();
  const { hasLedgerTransport, wasTransportAttempted } = useLedgerContext();
  const deviceCheck = useIsCorrectDeviceForActiveWallet();

  const state: State = wasTransportAttempted
    ? hasLedgerTransport && deviceCheck === 'correct'
      ? 'connected'
      : deviceCheck === 'incorrect'
        ? 'incorrect'
        : 'disconnected'
    : 'connecting';

  const BottomListItem = stateToComponent[state];

  return (
    <Page title={t('Ledger')} contentProps={contentProps}>
      <Card sx={{ px: 2 }}>
        <ListItem divider disableGutters>
          <ListItemBody3Text primary={t('Status')} />
          <ConnectionState state={state} />
        </ListItem>
        <BottomListItem />
      </Card>
      {state === 'disconnected' && <AvalancheAppNote />}
    </Page>
  );
};
