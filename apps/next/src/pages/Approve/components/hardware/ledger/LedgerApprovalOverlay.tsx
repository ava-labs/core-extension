import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayData } from '@avalabs/vm-module-types';
import { Button, getHexAlpha, Slide, Stack, styled } from '@avalabs/k2-alpine';

import { Action, ActionStatus, NetworkWithCaipId } from '@core/types';

import { useLedgerApprovalState } from './useLedgerApprovalState';
import {
  Disconnected,
  IncorrectApp,
  IncorrectVersion,
  Loading,
  PendingApproval,
} from './components';
import { LedgerApprovalState, StateComponentProps } from './types';

type LedgerApprovalOverlayProps = {
  action: Action<DisplayData>;
  approve: () => Promise<unknown>;
  reject: () => void;
  network: NetworkWithCaipId;
};

const ComponentPerState: Record<
  LedgerApprovalState['state'],
  FC<StateComponentProps>
> = {
  loading: Loading,
  pending: PendingApproval,
  disconnected: Disconnected,
  'incorrect-app': IncorrectApp,
  'incorrect-version': IncorrectVersion,
};

export const LedgerApprovalOverlay: FC<LedgerApprovalOverlayProps> = ({
  network,
  action,
  approve,
  reject,
}) => {
  const { t } = useTranslation();
  const state = useLedgerApprovalState(network, action);

  const Component = ComponentPerState[state.state];

  // Send the signing request to the Ledger device
  // once we reach the "pending" state.
  useEffect(() => {
    if (
      state.state === 'pending' &&
      action.status !== ActionStatus.SUBMITTING
    ) {
      approve();
    }
  }, [state.state, approve, action.status]);

  return (
    <Slide in direction="up">
      <Drawer>
        <DrawerContent>
          <Stack flexGrow={1}>
            <Component state={state} approve={approve} reject={reject} />
          </Stack>
          <Button
            variant="contained"
            color="secondary"
            size="extension"
            onClick={reject}
          >
            {t('Cancel')}
          </Button>
        </DrawerContent>
      </Drawer>
    </Slide>
  );
};

const Drawer = styled(Stack)(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  inset: 0,
  zIndex: 2000,
  background: getHexAlpha(
    theme.palette.neutral[850],
    theme.palette.mode === 'light' ? 30 : 50,
  ),
  justifyContent: 'flex-end',

  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  animation: `fadeIn 0.15s ease-in-out`,
}));

const DrawerContent = styled(Stack)(({ theme }) => ({
  width: '100vw',
  height: '66.67vh',
  position: 'relative',
  gap: theme.spacing(1),
  paddingBlock: theme.spacing(2),
  paddingInline: theme.spacing(1.5),
  boxShadow: '0 -10px 32px 0 rgba(0, 0, 0, 0.10)',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.neutral[850],
}));
