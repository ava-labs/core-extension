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
  const { nftEnabledNetworks } = useNetworkContext();

  return (
    <DropdownMenu label={t('Filter')}>
      <PopoverItem
        onClick={clearNetworkFilter}
        selected={selectedNetworks.length === 0}
      >
        <span data-testid="collectibles-filter-option-all-networks">
          {t('All networks')}
        </span>
      </PopoverItem>
      {nftEnabledNetworks.map((network) => (
        <PopoverItem
          key={network.caip2Id}
          onClick={() => onNetworkChange(network.chainId)}
          selected={selectedNetworks.includes(network.chainId)}
        >
          <span
            data-testid={`collectibles-filter-option-network-${network.chainId}`}
          >
            {network.chainName}
          </span>
        </PopoverItem>
      ))}
      <NetworkDivider />
      <PopoverItem
        onClick={() => onTypeChange('all')}
        selected={typeFilter.all}
      >
        <span data-testid="collectibles-filter-option-all-types">
          {t('All types')}
        </span>
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('picture')}
        selected={typeFilter.picture && !typeFilter.all}
      >
        <span data-testid="collectibles-filter-option-picture">
          {t('Pictures')}
        </span>
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('gif')}
        selected={typeFilter.gif && !typeFilter.all}
      >
        <span data-testid="collectibles-filter-option-gif">{t('GIFs')}</span>
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('video')}
        selected={typeFilter.video && !typeFilter.all}
      >
        <span data-testid="collectibles-filter-option-video">
          {t('Videos')}
        </span>
      </PopoverItem>
    </DropdownMenu>
  );
}
