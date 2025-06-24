import { StackRow } from '@/components/StackRow';
import { Typography } from '@/components/Typography';
import {
  Button,
  getHexAlpha,
  ListItemIcon,
  Stack,
  styled,
  SxProps,
  Theme,
  toast,
  Tooltip,
  truncateAddress,
  useTheme,
} from '@avalabs/k2-alpine';
import { stripAddressPrefix } from '@core/common';
import { ComponentType, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBaseProps } from 'react-icons';

interface IconProps extends IconBaseProps {
  sx?: SxProps<Theme>;
}

type Props = {
  Icon: ComponentType<IconProps>;
  label: string;
  address: string | undefined;
  lastElement?: boolean;
};

const GhostButton = styled(Button)(({ theme }) => ({
  marginInlineStart: 'auto',
  opacity: 0,
  transition: theme.transitions.create(['opacity']),
}));

export const AccountItem: FC<Props> = ({
  Icon,
  label,
  address,
  lastElement,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!address) {
    return null;
  }

  const strippedAddress = stripAddressPrefix(address);

  return (
    <Stack
      sx={{
        paddingTop: 1.2,
        cursor: 'pointer',
        ':hover button': {
          opacity: 1,
        },
      }}
    >
      <StackRow>
        <ListItemIcon
          sx={{
            minWidth: '24px',
            marginRight: 1,
            paddingY: 0.5,
            paddingLeft: 1.2,
          }}
        >
          <Icon
            size={24}
            sx={{
              border: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
              width: '26px',
              height: '26px',
              borderRadius: '50%',
            }}
          />
        </ListItemIcon>
        <Stack sx={{ width: '100%' }}>
          <StackRow
            sx={{
              paddingRight: theme.spacing(1.2),
            }}
          >
            <Stack direction="column" gap={0.5} marginInlineEnd={1}>
              <Typography variant="caption" color="text.primary">
                {label}
              </Typography>
              <Tooltip title={strippedAddress} enterDelay={1000}>
                <Typography variant="monospace" color="text.secondary">
                  {truncateAddress(strippedAddress)}
                </Typography>
              </Tooltip>
            </Stack>
            <GhostButton
              variant="contained"
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast.success(t('Address copied!'));
              }}
            >
              {t('Copy')}
            </GhostButton>
          </StackRow>
          <hr
            style={{
              width: '100%',
              paddingTop: lastElement ? 0 : theme.spacing(1),
              border: 'none',
              borderBottom: lastElement
                ? 'none'
                : `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
            }}
          />
        </Stack>
      </StackRow>
    </Stack>
  );
};
