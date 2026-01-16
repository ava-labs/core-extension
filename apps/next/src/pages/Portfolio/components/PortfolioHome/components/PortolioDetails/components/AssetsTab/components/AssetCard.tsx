import {
  Box,
  ChevronRightIcon,
  Skeleton,
  Stack,
  Theme,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { TokenType } from '@avalabs/vm-module-types';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { Card } from '@/components/Card';
import { CollapsedTokenAmount } from '@/components/CollapsedTokenAmount';
import { TokenAvatar } from '@/components/TokenAvatar';
import { FungibleTokenBalance } from '@core/types';
import { useSettingsContext } from '@core/ui';
import { ProfitAndLoss } from '../../ProfitAndLoss';

interface AssetCardProps {
  asset: FungibleTokenBalance;
}

const AVATAR_SIZE = 32;
const BADGE_SIZE = 16;
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

export const AssetCard: FC<AssetCardProps> = ({ asset }) => {
  const theme = useTheme();
  const history = useHistory();
  const { privacyMode } = useSettingsContext();
  const handleClick = () => {
    const tokenAddress =
      asset.type === TokenType.NATIVE ? asset.symbol : asset.address;
    history.push(`/asset/${asset.coreChainId}/${tokenAddress}`);
  };

  const badgeBorderColor = getBadgeBorderColor(theme);

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: CARD_BORDER_RADIUS,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack
        role="button"
        onClick={handleClick}
        direction="row"
        alignItems="center"
        gap={CARD_GAP}
        px={CARD_PADDING_X}
        py={CARD_PADDING_Y}
        sx={{
          cursor: 'pointer',
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

        <Stack flexGrow={1} minWidth={0} gap={0}>
          <Typography
            variant="subtitle3"
            noWrap
            fontWeight="600"
            color="text.primary"
          >
            {asset.name}
          </Typography>
          {!privacyMode ? (
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              width="max-content"
              justifyContent="flex-start"
            >
              <CollapsedTokenAmount
                amount={asset.balanceDisplayValue}
                showApproximationSign={false}
                regularProps={{ variant: 'body3' }}
                overlineProps={{ variant: 'caption2' }}
              />
              <Typography color="text.primary" variant="body3">
                {asset.symbol}
              </Typography>
            </Stack>
          ) : (
            <Skeleton height={18} width={70} animation={false} />
          )}
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
          <ChevronRightIcon
            size={CHEVRON_SIZE}
            sx={{ color: 'text.secondary' }}
          />
        </Box>
      </Stack>
    </Card>
  );
};
