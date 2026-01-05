import { PopoverItem } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MediaTypeFilters } from '../hooks/useCollectiblesToolbar';
import { DropdownMenu } from '@/components/DropdownMenu';
import { NetworkDivider } from './Styled';
import { useNetworkContext } from '@core/ui';

interface CollectiblesFilterProps {
  typeFilter: MediaTypeFilters;
  selectedNetworks: number[];
  onTypeChange: (type: keyof MediaTypeFilters) => void;
  onNetworkChange: (chainId: number) => void;
  clearNetworkFilter: () => void;
}

export function CollectiblesFilter({
  typeFilter,
  onTypeChange,
  selectedNetworks,
  onNetworkChange,
  clearNetworkFilter,
}: CollectiblesFilterProps) {
  const { t } = useTranslation();
  const { enabledNetworks } = useNetworkContext();

  return (
    <DropdownMenu label={t('Filter')}>
      <PopoverItem
        onClick={clearNetworkFilter}
        selected={selectedNetworks.length === 0}
      >
        {t('All networks')}
      </PopoverItem>
      {enabledNetworks.map((network) => (
        <PopoverItem
          key={network.caip2Id}
          onClick={() => onNetworkChange(network.chainId)}
          selected={selectedNetworks.includes(network.chainId)}
        >
          {network.chainName}
        </PopoverItem>
      ))}
      <NetworkDivider />
      <PopoverItem
        onClick={() => onTypeChange('all')}
        selected={typeFilter.all}
      >
        {t('All types')}
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('picture')}
        selected={typeFilter.picture && !typeFilter.all}
      >
        {t('Pictures')}
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('gif')}
        selected={typeFilter.gif && !typeFilter.all}
      >
        {t('GIFs')}
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('video')}
        selected={typeFilter.video && !typeFilter.all}
      >
        {t('Videos')}
      </PopoverItem>
    </DropdownMenu>
  );
}
