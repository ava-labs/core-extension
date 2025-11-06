import { Page } from '@/components/Page';
import { Dialog, Stack, Switch, Typography, Box } from '@avalabs/k2-alpine';
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
  hideUnreachable: boolean;
  toggleHideUnreachable: () => void;
};

export const CollectiblesManagePopup = ({
  open,
  onClose,
  collectibles,
  hiddenCollectibles,
  toggleCollectible,
  hideUnreachable,
  toggleHideUnreachable,
}: CollectiblesManagePopupProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCollectibles = useMemo(() => {
    return collectibles.filter((collectible) => {
      const matchesSearch =
        collectible.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collectible.address
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collectible.collectionName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collectible.tokenId?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1.5,
            }}
          >
            <Typography variant="body2">
              {t('Hide unreachable collectibles')}
            </Typography>
            <Switch
              checked={hideUnreachable}
              onChange={toggleHideUnreachable}
              size="small"
            />
          </Box>
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
