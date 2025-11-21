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
  selected: Set<number>;
  onChange: (networks: Set<NetworkWithCaipId['chainId']>) => void;
  networks: NetworkWithCaipId[];
};

export const FilterMenu: FC<FilterMenuProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  selected,
  onChange,
  networks,
}) => {
  const { t } = useTranslation();

  const handleNetworkToggle = (chainId: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(chainId)) {
      newSelected.delete(chainId);
    } else {
      newSelected.add(chainId);
    }
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    onChange(new Set());
  };

  const isAllSelected = selected.size === 0;

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
        {networks.map((network) => {
          const isSelected = selected.has(network.chainId);
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
