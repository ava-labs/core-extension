import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  Switch,
} from '@avalabs/k2-alpine';
import { FC, memo } from 'react';
import { FormattedCollectible } from '../CollectiblesTab';
import { CollectibleCard } from './CollectibleCard';

interface Props {
  collectible: FormattedCollectible;
  isHidden: boolean;
  onToggle: (collectible: FormattedCollectible) => void;
}

const listItemProps: ListItemProps = {
  disablePadding: true,
  disableGutters: true,
  sx: {
    pr: 5,
  },
};

const listItemTextProps: ListItemTextProps = {
  slotProps: {
    primary: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
};

export const CollectibleListItem: FC<Props> = memo(
  function CollectibleListItem({ collectible, isHidden, onToggle }) {
    return (
      <ListItem
        key={collectible.uniqueCollectibleId}
        secondaryAction={
          <Switch
            checked={!isHidden}
            onChange={() => onToggle(collectible)}
            size="small"
          />
        }
        {...listItemProps}
      >
        <ListItemIcon>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              backgroundColor: 'background.paper',
            }}
          >
            <CollectibleCard
              key={collectible.uniqueCollectibleId}
              collectible={collectible}
              onClick={() => {}}
              onImageDimensions={() => {}}
              showTokenId={false}
            />
          </Box>
        </ListItemIcon>
        <ListItemText
          {...listItemTextProps}
          primary={collectible.tokenId}
          secondary={collectible.name || collectible.collectionName}
        />
      </ListItem>
    );
  },
);
