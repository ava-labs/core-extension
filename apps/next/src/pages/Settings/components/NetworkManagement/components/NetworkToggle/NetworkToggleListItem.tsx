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
  isAlwaysEnabled: boolean;
  onToggle: () => void;
  onClick: () => void;
};

export const NetworkToggleListItem = ({
  network,
  isEnabled,
  isAlwaysEnabled,
  onToggle,
  onClick,
}: NetworkToggleListItemProps) => {
  const { capture } = useAnalyticsContext();

  return (
    <ListItem
      data-testid={`network-item-${network.chainId}`}
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
      {isAlwaysEnabled ? null : (
        <Switch
          data-testid={`network-toggle-${network.chainId}`}
          size="small"
          checked={isEnabled}
          disabled={isAlwaysEnabled}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </ListItem>
  );
};
