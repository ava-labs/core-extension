import { NetworkWithCaipId } from '@core/types';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@avalabs/k2-alpine';
import { NetworkAvatar } from '../NetworkAvatar/NetworkAvatar';

type NetworkToggleListItemProps = {
  network: NetworkWithCaipId;
  isEnabled: boolean;
  isDefault: boolean;
  onToggle: () => void;
  onClick: () => void;
};

export const NetworkToggleListItem = ({
  network,
  isEnabled,
  isDefault,
  onToggle,
  onClick,
}: NetworkToggleListItemProps) => {
  return (
    <ListItem sx={{ px: 0 }} onClick={onClick} style={{ cursor: 'pointer' }}>
      <ListItemIcon>
        <NetworkAvatar
          network={network}
          sx={{ width: '40px', height: '40px' }}
        />
      </ListItemIcon>
      <ListItemText primary={network.chainName} />
      <Switch
        size="small"
        checked={isEnabled}
        disabled={isDefault}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
      />
    </ListItem>
  );
};
