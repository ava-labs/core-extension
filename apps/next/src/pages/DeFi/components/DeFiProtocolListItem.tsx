import { FC } from 'react';
import {
  ListItemText,
  Typography,
  OutboundIcon,
  ChevronRightIcon,
  IconButton,
} from '@avalabs/k2-alpine';

import { DefiProtocol } from '@core/types';

import { DeFiProtocolAvatar } from './DeFiProtocolAvatar';

import { useHistory } from 'react-router-dom';
import { useConvertedCurrencyFormatter } from '@core/ui';

import { openNewTab } from '@core/common';
import { ListItemButton, ListItemStartIcon, ListItemEndIcon } from './Styled';

type DeFiProtocolListItemProps = {
  protocol: DefiProtocol;
};

export const DeFiProtocolListItem: FC<DeFiProtocolListItemProps> = ({
  protocol,
}) => {
  const history = useHistory();
  const formatValue = useConvertedCurrencyFormatter();

  if (protocol.groups.length === 0) {
    /**
     * It's very unlikely, but technically possible that we'll get an empty protocol item
     * from the backend.
     *
     * This mechanism is useful if the user re-activates the extension after closing all
     * positions on a dApp and then lands directly on /defi/:protocolId page.
     * In such situations, we want them to see an empty details screen for that dApp.
     *
     * However if they land here, on the main DeFi page, we don't want to show
     * those protocols in the list anymore.
     */
    return null;
  }

  return (
    <ListItemButton onClick={() => history.push(`/defi/${protocol.id}`)}>
      <ListItemStartIcon>
        <DeFiProtocolAvatar protocol={protocol} />
      </ListItemStartIcon>
      <ListItemText
        slotProps={{
          primary: {
            fontWeight: 'bold',
            lineHeight: 1.2,
          },
        }}
        primary={protocol.name}
        secondary={
          <Typography
            component="span"
            variant="body2"
            display="flex"
            alignItems="center"
            gap={0.5}
          >
            {formatValue(protocol.totalUsdValue)}
            <IconButton
              component="a"
              size="small"
              onClick={() =>
                openNewTab({
                  url: protocol?.siteUrl,
                })
              }
            >
              <OutboundIcon size={16} />
            </IconButton>
          </Typography>
        }
      />
      <ListItemEndIcon>
        <ChevronRightIcon size={22} />
      </ListItemEndIcon>
    </ListItemButton>
  );
};
