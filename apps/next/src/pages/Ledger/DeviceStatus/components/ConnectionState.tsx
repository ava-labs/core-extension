import {
  Box,
  BoxProps,
  CircularProgress,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { State } from '../types';

type Props = {
  state: State;
};

const stateToConfig: Record<
  Exclude<State, 'connecting'>,
  { color: BoxProps['bgcolor']; getText: (t: TFunction) => string }
> = {
  connected: {
    color: 'success.main',
    getText: (t) => t('Connected'),
  },
  disconnected: {
    color: 'error.main',
    getText: (t) => t('Disconnected'),
  },
  incorrect: {
    color: 'warning.main',
    getText: (t) => t('Incorrect device connected'),
  },
};

export const ConnectionState: FC<Props> = ({ state }) => {
  const { t } = useTranslation();

  if (state === 'connecting') {
    return <CircularProgress size={16} />;
  }

  const { color, getText } = stateToConfig[state];

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Dot bgcolor={color} />
      <Typography variant="caption">{getText(t)}</Typography>
    </Stack>
  );
};

const Dot = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  padding: theme.spacing(0.25),
  backgroundClip: 'content-box',
  borderRadius: theme.shape.fullBorderRadius,
}));
