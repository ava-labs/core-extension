import { NetworkWithCaipId } from '@core/types';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@avalabs/k2-alpine';
import { NetworkAvatar } from './BadgedAvatar/NetworkAvatar';

type NetworkToggleListItemProps = {
  network: NetworkWithCaipId;
  isEnabled: boolean;
  isDefault: boolean;
  onToggle: () => void;
};

export const NetworkToggleListItem = ({
  network,
  isEnabled,
  isDefault,
  onToggle,
}: NetworkToggleListItemProps) => {
  return (
    <ListItem sx={{ px: 0 }}>
      <ListItemIcon>
        <NetworkAvatar network={network} />
      </ListItemIcon>
      <ListItemText primary={network.chainName} />
      <Switch checked={isEnabled} disabled={isDefault} onChange={onToggle} />
    </ListItem>
  );
};
