import { NetworkWithCaipId } from '@core/types';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui';
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
  const { capture } = useAnalyticsContext();

  return (
    <ListItem
      sx={{ px: 0 }}
      onClick={() => {
        capture('NetworkDetailsClicked', { chainId: network.chainId });
        onClick();
      }}
      style={{ cursor: 'pointer' }}
    >
      <ListItemIcon>
        <NetworkAvatar
          network={network}
          sx={{ width: '40px', height: '40px' }}
        />
      </ListItemIcon>
      <ListItemText primary={network.chainName} />
      {isDefault ? null : (
        <Switch
          size="small"
          checked={isEnabled}
          disabled={isDefault}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </ListItem>
  );
};
