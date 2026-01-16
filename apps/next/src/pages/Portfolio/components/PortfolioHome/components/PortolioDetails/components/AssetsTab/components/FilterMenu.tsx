import { PopoverItem, Box } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkWithCaipId } from '@core/types';
import { DropdownMenu } from '@/components/DropdownMenu';

export type FilterMenuProps = {
  id: string;
  selected: Set<number>;
  onChange: (networks: Set<NetworkWithCaipId['chainId']>) => void;
  networks: NetworkWithCaipId[];
};

export const FilterMenu: FC<FilterMenuProps> = ({
  id,
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
    <Box id={id}>
      <DropdownMenu label={t('Filter')} closeOnItemClick={false}>
        <PopoverItem onClick={handleSelectAll} selected={isAllSelected}>
          {t('All Networks')}
        </PopoverItem>
        {networks.map((network) => {
          const isSelected = selected.has(network.chainId);
          return (
            <PopoverItem
              key={network.chainId}
              onClick={() => handleNetworkToggle(network.chainId)}
              selected={isSelected}
            >
              {network.chainName}
            </PopoverItem>
          );
        })}
      </DropdownMenu>
    </Box>
  );
};
