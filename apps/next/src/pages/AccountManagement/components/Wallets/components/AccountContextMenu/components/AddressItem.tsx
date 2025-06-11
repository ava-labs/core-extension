import { Typography } from '@/components/Typography';
import {
  Button,
  ListItemIcon,
  MenuItem,
  menuItemClasses,
  Stack,
  styled,
  toast,
  Tooltip,
  truncateAddress,
} from '@avalabs/k2-alpine';
import { stripAddressPrefix } from '@core/common';
import { ComponentType, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IconBaseProps } from 'react-icons';

type Props = {
  Icon: ComponentType<IconBaseProps>;
  label: string;
  address: string | undefined;
  onClose: VoidFunction;
};

export const AddressItem: FC<Props> = ({ Icon, label, address, onClose }) => {
  const { t } = useTranslation();

  if (!address) {
    return null;
  }

  const strippedAddress = stripAddressPrefix(address);

  return (
    <MenuItem>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <Stack direction="column" gap={0.5} marginInlineEnd={1}>
        <Typography variant="caption">{label}</Typography>
        <Tooltip title={strippedAddress} enterDelay={1000}>
          <Typography variant="monospace" color="text.secondary">
            {truncateAddress(strippedAddress)}
          </Typography>
        </Tooltip>
      </Stack>
      <GhostButton
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => {
          navigator.clipboard.writeText(address);
          toast.success(t('Address copied!'));
          onClose();
        }}
      >
        Copy
      </GhostButton>
    </MenuItem>
  );
};

const GhostButton = styled(Button)(({ theme }) => ({
  marginInlineStart: 'auto',
  opacity: 0,
  transition: theme.transitions.create(['opacity']),

  [`.${menuItemClasses.root}:hover &`]: {
    opacity: 1,
  },
}));
