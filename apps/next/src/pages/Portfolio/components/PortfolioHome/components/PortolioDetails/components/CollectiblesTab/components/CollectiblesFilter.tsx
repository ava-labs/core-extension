import { PopoverItem } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { MediaTypeFilters } from '../hooks/useCollectiblesToolbar';
import { DropdownMenu } from '@/components/DropdownMenu';

interface CollectiblesFilterProps {
  typeFilter: MediaTypeFilters;
  onTypeChange: (type: keyof MediaTypeFilters) => void;
}

export function CollectiblesFilter({
  typeFilter,
  onTypeChange,
}: CollectiblesFilterProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu label={t('Filter')}>
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
