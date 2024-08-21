import {
  NftTokenWithBalance,
  TokenType,
} from '@src/background/services/balances/models';
import {
  Stack,
  Switch,
  Typography,
  Divider,
} from '@avalabs/core-k2-components';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { CollectibleListEmpty } from '@src/pages/Collectibles/components/CollectibleListEmpty';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CollectibleMedia } from '@src/pages/Collectibles/components/CollectibleMedia';

type ManageTokensListProps = {
  searchQuery: string;
};

export const ManageCollectiblesList = ({
  searchQuery,
}: ManageTokensListProps) => {
  const { nfts } = useBalancesContext();

  if (nfts.items?.length === 0) {
    return (
      <Stack
        sx={{
          flexGrow: 1,
          pb: 9,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CollectibleListEmpty />
      </Stack>
    );
  }

  const displayableNfts = nfts.items?.filter((nft) => {
    if (!searchQuery.length) {
      return true;
    }

    return nft.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Stack
      sx={{ rowGap: '10px' }}
      data-testid="manage-collectibles-list"
      divider={<Divider flexItem sx={{ borderColor: 'grey.800' }} />}
    >
      {displayableNfts?.map((nft) => (
        <ManageCollectiblesListItem
          nft={nft}
          key={`collectible-${nft.name.toLowerCase()}`}
        />
      ))}
    </Stack>
  );
};

type ManageCollectiblesListItemProps = {
  nft: NftTokenWithBalance;
};

export const ManageCollectiblesListItem = ({
  nft,
}: ManageCollectiblesListItemProps) => {
  const { getCollectibleVisibility, toggleCollectibleVisibility } =
    useSettingsContext();

  return (
    <Stack
      direction="row"
      data-testid={`${nft.name.toLowerCase()}-collectible-list-item`}
      justifyContent="space-between"
      alignItems="center"
      sx={{ width: '100%' }}
    >
      <Stack direction="row" alignItems="center">
        <CollectibleMedia
          height="32px"
          width="auto"
          maxWidth="32px"
          url={nft?.logoSmall}
          hover={false}
          margin="8px 0"
          showPlayIcon={false}
          noAction={true}
        />
        <Stack sx={{ mx: 2 }}>
          <Typography sx={{ mb: 0.5 }} fontWeight="fontWeightSemibold">
            {nft.name}
          </Typography>
          {nft.type === TokenType.ERC1155 ? (
            <Typography sx={{ mb: 0.5 }}>{nft.balance.toString()}</Typography>
          ) : null}
        </Stack>
      </Stack>
      <Switch
        size="small"
        checked={getCollectibleVisibility(nft)}
        onChange={() => toggleCollectibleVisibility(nft)}
      />
    </Stack>
  );
};
