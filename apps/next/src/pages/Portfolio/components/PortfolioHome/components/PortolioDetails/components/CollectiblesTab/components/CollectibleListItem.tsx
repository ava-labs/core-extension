import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  Switch,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { FormattedCollectible } from '../CollectiblesTab';
import { MediaRenderer } from './MediaRenderer';

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

export const CollectibleListItem: FC<Props> = ({
  collectible,
  isHidden,
  onToggle,
}) => {
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
            backgroundColor: (theme) => theme.palette.grey[100],
          }}
        >
          <MediaRenderer
            collectible={collectible}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: 'background.default',
            }}
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
};
