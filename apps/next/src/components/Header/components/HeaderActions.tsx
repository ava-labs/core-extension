import {
  IconButton,
  QrCodeIcon,
  Stack,
  styled,
  SyncIcon,
  useTheme,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { ComponentProps, FC } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { ConnectedSites } from '../ConnectedSites';
import { ViewModeSwitcher } from '../ViewModeSwitcher';

type Props = {
  activeAccount: Account | undefined;
  pendingTransaction: boolean;
};

type AnimatedSyncIconProps = ComponentProps<typeof SyncIcon> & {
  pending: boolean;
};

const AnimatedSyncIcon = styled(SyncIcon, {
  shouldForwardProp: (prop) => prop !== 'pending',
})<AnimatedSyncIconProps>(({ pending }) => ({
  animationName: pending ? 'rotate' : 'none',
  animationDuration: '2s',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',

  '@keyframes rotate': {
    from: { transform: 'rotate(360deg)' },
    to: { transform: 'rotate(0deg)' },
  },
}));

export const HeaderActions: FC<Props> = ({
  activeAccount,
  pendingTransaction,
}) => {
  const history = useHistory();
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems="center">
      <ConnectedSites activeAccount={activeAccount} />
      <IconButton
        disabled={!activeAccount}
        size="small"
        onClick={() => history.push(`/receive?accId=${activeAccount?.id}`)}
      >
        <QrCodeIcon fill={theme.palette.text.primary} size={24} />
      </IconButton>
      <IconButton
        data-testid="settings-button"
        onClick={() => history.push('/settings')}
        size="small"
      >
        <FiSettings size={24} style={{ scale: 5 / 6 }} />
      </IconButton>
      <IconButton size="small">
        <AnimatedSyncIcon size={24} pending={pendingTransaction} />
      </IconButton>
      <ViewModeSwitcher />
    </Stack>
  );
};
