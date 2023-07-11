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
} from '@avalabs/k2-components';

import { DefiProtocol } from '@src/background/services/defi/models';
import { openNewTab } from '@src/utils/extensionUtils';

import { useConvertedCurrencyFormatter } from '../hooks/useConvertedCurrencyFormatter';

type DefiProtocolListItemProps = CardProps & {
  protocol: DefiProtocol;
};

export const DefiProtocolListItem = ({
  protocol,
  ...cardProps
}: DefiProtocolListItemProps) => {
  const theme = useTheme();
  const formatValue = useConvertedCurrencyFormatter();

  const openUrl = (url) => openNewTab({ url });

  return (
    <Card sx={{ width: '100%' }} {...cardProps}>
      <CardActionArea data-testid={`defi-protocol-${protocol.id}`}>
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
