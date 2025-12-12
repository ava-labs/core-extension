import {
  Box,
  Stack,
  styled,
  Typography,
  useTheme,
  Switch,
} from '@avalabs/k2-alpine';
import { Trans } from 'react-i18next';
import { Dispatch, FC, SetStateAction } from 'react';
import { ModeratorIcon } from '@/components/ModeratorIcon';

type InDrawerAlertProps = {
  isConfirmed: boolean;
  setIsConfirmed: Dispatch<SetStateAction<boolean>>;
};

export const InDrawerAlert: FC<InDrawerAlertProps> = ({
  isConfirmed,
  setIsConfirmed,
}) => {
  const theme = useTheme();
  return (
    <Wrapper>
      <Stack direction="row" gap={1} alignItems="start">
        <Box flexShrink={0} color="error.main" pl={0.5}>
          <ModeratorIcon color="error.main" size={24} />
        </Box>
        <Typography variant="caption" component="p">
          <Trans
            i18nKey="This transaction has been flagged as malicious. <span>I understand the risk and want to proceed anyway.</span>"
            components={{
              span: <span style={{ color: theme.palette.text.secondary }} />,
            }}
          />
        </Typography>
      </Stack>
      <Box flexShrink={0}>
        <Switch
          checked={isConfirmed}
          onChange={() => setIsConfirmed(!isConfirmed)}
        />
      </Box>
    </Wrapper>
  );
};

const Wrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  paddingInline: theme.spacing(2.5),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  marginInline: theme.spacing(-2),
  gap: theme.spacing(4),
  borderTop: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.alphaMatch.backdropSolid,
}));
