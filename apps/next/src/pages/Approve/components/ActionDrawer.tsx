import {
  Button,
  getHexAlpha,
  Slide,
  Stack,
  StackProps,
  styled,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayData } from '@avalabs/vm-module-types';

import { Action, ActionStatus, GaslessPhase } from '@core/types';

import { hasOverlayWarning } from '../lib';
import { InDrawerAlert } from './warnings/InDrawerAlert';
import { useGasless } from '../hooks';

type ActionDrawerProps = StackProps & {
  open: boolean;
  approve?: () => void;
  reject?: () => void;
  action: Action<DisplayData>;
};

export const ActionDrawer = ({
  open,
  approve,
  reject,
  action,
  ...props
}: ActionDrawerProps) => {
  const { t } = useTranslation();

  const { gaslessPhase } = useGasless({ action });

  const isMalicious = hasOverlayWarning(action);
  const [userHasConfirmed, setUserHasConfirmed] = useState(false);

  const isProcessing =
    action.status === ActionStatus.SUBMITTING ||
    gaslessPhase === GaslessPhase.FUNDING_IN_PROGRESS;

  return (
    <Slide in={open} direction="up" mountOnEnter unmountOnExit>
      <Drawer {...props}>
        {isMalicious && (
          <InDrawerAlert
            isConfirmed={userHasConfirmed}
            setIsConfirmed={setUserHasConfirmed}
          />
        )}
        <Stack gap={1}>
          {approve && (
            <Button
              variant="contained"
              color="primary"
              size="extension"
              onClick={approve}
              disabled={isProcessing || (isMalicious && !userHasConfirmed)}
              loading={isProcessing}
            >
              {t('Approve')}
            </Button>
          )}
          {reject && (
            <Button
              variant="contained"
              color="secondary"
              size="extension"
              onClick={reject}
              disabled={isProcessing}
            >
              {t('Reject')}
            </Button>
          )}
        </Stack>
      </Drawer>
    </Slide>
  );
};

export const Drawer = styled(Stack)(({ theme }) => ({
  width: '100%',
  position: 'sticky',
  bottom: 0,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  paddingInline: theme.spacing(2),
  gap: theme.spacing(1),
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 22.5%)'
      : `linear-gradient(180deg, ${getHexAlpha(theme.palette.alphaMatch.backdropSolid, 0)} 0%, ${theme.palette.alphaMatch.backdropSolid} 22.5%)`,
}));
