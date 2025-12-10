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

import { InDrawerAlert } from './warnings/InDrawerAlert';

type ActionDrawerProps = StackProps & {
  open: boolean;
  approve?: () => void;
  approveText?: string;
  reject?: () => void;
  withConfirmationSwitch?: boolean;
  isProcessing: boolean;
  isDisabled?: boolean;
};

export const ActionDrawer = ({
  open,
  approve,
  approveText,
  reject,
  withConfirmationSwitch,
  isProcessing,
  isDisabled = false,
  ...props
}: ActionDrawerProps) => {
  const { t } = useTranslation();

  const [userHasConfirmed, setUserHasConfirmed] = useState(false);

  return (
    <Slide in={open} direction="up" mountOnEnter unmountOnExit>
      <Drawer {...props}>
        {withConfirmationSwitch && (
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
              disabled={
                isDisabled ||
                isProcessing ||
                (withConfirmationSwitch && !userHasConfirmed)
              }
              loading={isProcessing}
            >
              {approveText || t('Approve')}
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
  zIndex: theme.zIndex.drawer,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  paddingInline: theme.spacing(2),
  gap: theme.spacing(1),
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 22.5%)'
      : `linear-gradient(180deg, ${getHexAlpha(theme.palette.alphaMatch.backdropSolid, 0)} 0%, ${theme.palette.alphaMatch.backdropSolid} 22.5%)`,
}));
