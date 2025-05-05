import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardActionArea,
  CardProps,
  ExternalLinkIcon,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';

import { DefiProtocol } from '@core/types';
import { openNewTab } from '@core/common';

import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';

type DefiProtocolListItemProps = CardProps & {
  protocol: DefiProtocol;
};

export const DefiProtocolListItem = ({
  protocol,
  ...cardProps
}: DefiProtocolListItemProps) => {
  const theme = useTheme();
  const history = useHistory();
  const formatValue = useConvertedCurrencyFormatter();

  const openUrl = (url) => openNewTab({ url });

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
    <Card sx={{ width: '100%' }} {...cardProps}>
      <CardActionArea
        onClick={() => history.push(`/defi/${protocol.id}`)}
        data-testid={`defi-protocol-${protocol.id}`}
      >
        <Stack
          direction="row"
          sx={{
            height: 60,
            py: 1.5,
            px: 2,
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            src={protocol.logoUrl}
            alt={protocol.name}
            secondarySrc={protocol.chainLogoUrl}
            secondaryAvatarProps={{
              sx: {
                width: 14,
                height: 14,
                border: `1px solid ${theme.palette.grey[900]}`,
              },
            }}
            badgeProps={{
              // eslint-disable-next-line
              // @ts-ignore
              'data-testid': `defi-protocol-chain-${protocol.chainId}`,
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            }}
          />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
            data-testid="defi-protocol-name"
          >
            {protocol.name}
          </Typography>
          <Stack sx={{ alignItems: 'flex-end' }}>
            <Typography
              variant="button"
              sx={{ fontSize: 14 }}
              data-testid="defi-protocol-value"
            >
              {formatValue(protocol.totalUsdValue)}
            </Typography>
            <IconButton
              component="a"
              size="small"
              sx={{ mr: -0.5 }}
              onClick={() => openUrl(protocol.siteUrl)}
              data-testid="defi-protocol-link"
            >
              <ExternalLinkIcon size={16} />
            </IconButton>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};
