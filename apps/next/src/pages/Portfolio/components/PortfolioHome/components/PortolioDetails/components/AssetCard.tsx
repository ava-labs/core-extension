import {
  Box,
  ChevronRightIcon,
  Stack,
  Theme,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { ProfitAndLoss } from './ProfitAndLoss';
import { FungibleTokenBalance } from '@core/types';
import { TokenAvatar } from '@/components/TokenAvatar';
import { Card } from '@/components/Card';

interface AssetCardProps {
  asset: FungibleTokenBalance;
  onClick?: () => void;
}

const AVATAR_SIZE = 40;
const BADGE_SIZE = 18;
const CHEVRON_SIZE = 20;
const CARD_BORDER_RADIUS = 2;
const CARD_GAP = 1.5;
const CARD_PADDING_X = 1.5;
const CARD_PADDING_Y = 1;

const getBadgeBorderColor = (theme: Theme): string => {
  return theme.palette.mode === 'dark'
    ? '#47474c'
    : theme.palette.surface.primary;
};

const formatTokenBalance = (balance: string, symbol: string): string => {
  return `${balance} ${symbol}`;
};

export const AssetCard = ({ asset, onClick }: AssetCardProps) => {
  const theme = useTheme();

  const handleClick = () => {
    onClick?.();
    // TODO: Navigate to asset details page when route is available
    // const history = useHistory();
    // history.push(`/asset/${asset.symbol}`);
  };

  const badgeBorderColor = getBadgeBorderColor(theme);
  const tokenBalanceText = formatTokenBalance(
    asset.balanceDisplayValue,
    asset.symbol,
  );

  return (
    <Card sx={{ width: '100%', borderRadius: CARD_BORDER_RADIUS }}>
      <Stack
        role="button"
        onClick={handleClick}
        direction="row"
        alignItems="center"
        gap={CARD_GAP}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          px: theme.spacing(CARD_PADDING_X),
          py: theme.spacing(CARD_PADDING_Y),
        }}
      >
        <Box flexShrink={0}>
          <TokenAvatar
            token={asset}
            size={AVATAR_SIZE}
            badgeSize={BADGE_SIZE}
            badgeSx={{
              borderColor: badgeBorderColor,
            }}
          />
        </Box>

        <Stack flexGrow={1} minWidth={0}>
          <Typography
            variant="subtitle3"
            noWrap
            fontWeight="600"
            color="text.primary"
          >
            {asset.name}
          </Typography>
          <Typography color="text.primary" variant="body3" noWrap>
            {tokenBalanceText}
          </Typography>
        </Stack>

        <Stack alignItems="flex-end" flexShrink={0}>
          <ProfitAndLoss asset={asset} />
        </Stack>

        <Box
          display="flex"
          flexShrink={0}
          alignItems="center"
          justifyContent="center"
        >
          <ChevronRightIcon size={CHEVRON_SIZE} color="text.secondary" />
        </Box>
      </Stack>
    </Card>
  );
};
