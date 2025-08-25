import {
  Button,
  getHexAlpha,
  Slide,
  Stack,
  StackProps,
  styled,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { DisplayData } from '@avalabs/vm-module-types';

import { Action, ActionStatus } from '@core/types';

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

  return (
    <Slide in={open} direction="up" mountOnEnter unmountOnExit>
      <Drawer {...props}>
        {approve && (
          <Button
            variant="contained"
            color="primary"
            size="extension"
            onClick={approve}
            disabled={action.status === ActionStatus.SUBMITTING}
            loading={action.status === ActionStatus.SUBMITTING}
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
            disabled={action.status === ActionStatus.SUBMITTING}
            loading={action.status === ActionStatus.SUBMITTING}
          >
            {t('Reject')}
          </Button>
        )}
      </Drawer>
    </Slide>
  );
};

const Drawer = styled(Stack)(({ theme }) => ({
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
