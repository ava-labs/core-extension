import { PopoverItem } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { DropdownMenu } from '@/components/DropdownMenu';

export type FilterType = 'all' | 'pictures' | 'gifs' | 'videos';

interface CollectiblesFilterProps {
  typeFilter: FilterType;
  showHidden: boolean;
  onTypeChange: (type: FilterType) => void;
  onToggleHidden: () => void;
}

export function CollectiblesFilter({
  typeFilter,
  showHidden,
  onTypeChange,
  onToggleHidden,
}: CollectiblesFilterProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu label={t('Filter')}>
      <PopoverItem
        onClick={() => onTypeChange('all')}
        selected={typeFilter === 'all'}
      >
        {t('All types')}
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('pictures')}
        selected={typeFilter === 'pictures'}
      >
        {t('Pictures')}
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('gifs')}
        selected={typeFilter === 'gifs'}
      >
        {t('GIFs')}
      </PopoverItem>
      <PopoverItem
        onClick={() => onTypeChange('videos')}
        selected={typeFilter === 'videos'}
      >
        {t('Videos')}
      </PopoverItem>
      <PopoverItem onClick={onToggleHidden} selected={showHidden}>
        {t('Show hidden NFTs')}
      </PopoverItem>
    </DropdownMenu>
  );
}
