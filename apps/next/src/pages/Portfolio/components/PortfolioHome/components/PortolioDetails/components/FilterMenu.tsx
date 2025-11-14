import {
  List,
  ListItemButton,
  ListItemText,
  Popover,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { NetworkWithCaipId } from '@core/types';

export type FilterMenuProps = {
  id: string;
  anchorEl: HTMLButtonElement | null;
  open: boolean;
  onClose: () => void;
  selectedNetworks: Set<number>;
  setSelectedNetworks: (networks: Set<number>) => void;
  availableNetworks: NetworkWithCaipId[];
};

export const FilterMenu: FC<FilterMenuProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  selectedNetworks,
  setSelectedNetworks,
  availableNetworks,
}) => {
  const { t } = useTranslation();

  const handleNetworkToggle = (chainId: number) => {
    const newSelected = new Set(selectedNetworks);
    if (newSelected.has(chainId)) {
      newSelected.delete(chainId);
    } else {
      newSelected.add(chainId);
    }
    setSelectedNetworks(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedNetworks(new Set());
  };

  const isAllSelected = selectedNetworks.size === 0;

  return (
    <Popover id={id} open={open} anchorEl={anchorEl} onClose={onClose}>
      <List sx={{ width: '210px' }}>
        <ListItemButton
          dense
          sx={{
            paddingY: 0.5,
            borderRadius: 1,
          }}
          onClick={handleSelectAll}
          selected={isAllSelected}
        >
          <ListItemText primary={t('All Networks')} />
          {isAllSelected && <MdCheck size={16} />}
        </ListItemButton>
        {availableNetworks.map((network) => {
          const isSelected = selectedNetworks.has(network.chainId);
          return (
            <ListItemButton
              key={network.chainId}
              dense
              sx={{
                paddingY: 0.5,
                borderRadius: 1,
              }}
              onClick={() => handleNetworkToggle(network.chainId)}
              selected={isSelected}
            >
              <ListItemText primary={network.chainName} />
              {isSelected && <MdCheck size={16} />}
            </ListItemButton>
          );
        })}
      </List>
    </Popover>
  );
};
