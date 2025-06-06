import {
  Button,
  ListItemIcon,
  MenuItem,
  menuItemClasses,
  Stack,
  styled,
  Tooltip,
  truncateAddress,
} from '@avalabs/k2-alpine';
import { Typography } from '@/components/Typography';

import { ComponentType, FC } from 'react';
import { IconBaseProps } from 'react-icons';

type Props = {
  Icon: ComponentType<IconBaseProps>;
  label: string;
  address: string | undefined;
  onClose: VoidFunction;
};

export const AddressItem: FC<Props> = ({ Icon, label, address, onClose }) => {
  if (!address) {
    return null;
  }

  return (
    <MenuItem>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <Stack direction="column" gap={0.5} marginInlineEnd={1}>
        <Typography variant="caption">{label}</Typography>
        <Tooltip title={address} enterDelay={1000}>
          <Typography variant="monospace" color="text.secondary">
            {truncateAddress(address)}
          </Typography>
        </Tooltip>
      </Stack>
      <GhostButton
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => {
          navigator.clipboard.writeText(address);
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
