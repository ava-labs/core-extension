import { Page } from '@/components/Page';
import { Dialog, Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FormattedCollectible } from '../CollectiblesTab';
import { SearchField } from '@/pages/Contacts/components/SearchField';
import { useMemo, useState } from 'react';
import { CollectibleSwitchList } from './CollectibleSwitchList';

export type CollectiblesManagePopupProps = {
  open: boolean;
  onClose: () => void;
  collectibles: FormattedCollectible[];
  hiddenCollectibles: Set<string>;
  toggleCollectible: (collectible: FormattedCollectible) => void;
};

export const CollectiblesManagePopup = ({
  open,
  onClose,
  collectibles,
  hiddenCollectibles,
  toggleCollectible,
}: CollectiblesManagePopupProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCollectibles = useMemo(() => {
    return collectibles.filter((collectible) => {
      return (
        collectible.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collectible.address
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collectible.collectionName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collectible.tokenId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [collectibles, searchQuery]);
  return (
    <Dialog fullScreen={true} open={open} onClose={onClose}>
      <Page
        title={t('Manage Collectibles')}
        withBackButton={true}
        onBack={onClose}
        contentProps={{ justifyContent: 'flex-start', width: '100%' }}
        containerProps={{ width: '100%' }}
      >
        <Stack
          width="100%"
          flexGrow={1}
          justifyContent="flex-start"
          alignItems="stretch"
          gap={1}
        >
          <SearchField
            autoFocus
            placeholder={t('Search')}
            size="small"
            sx={{ width: '100%' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.trim())}
          />
          <CollectibleSwitchList
            collectibles={filteredCollectibles}
            hiddenCollectibles={hiddenCollectibles}
            toggleCollectible={toggleCollectible}
            filter={searchQuery}
          />
        </Stack>
      </Page>
    </Dialog>
  );
};
