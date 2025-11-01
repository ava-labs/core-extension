import { Avatar, Box, Stack, Typography } from '@avalabs/k2-alpine';
import { ProfitAndLoss } from './ProfitAndLoss';
import { FungibleTokenBalance } from '@core/types';

interface AssetCardProps {
  asset: FungibleTokenBalance;
  last?: boolean;
}

export const AssetCard = ({ asset, last }: AssetCardProps) => {
  console.log('asset: ', asset);
  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pt={1}
    >
      {/* Left side - Avatar */}
      <Box position="relative" sx={{ transform: 'translateY(-4px)' }}>
        <Avatar
          alt={asset.symbol}
          src={asset.logoUri || undefined}
          sx={{ width: 36, height: 36 }}
        >
          {asset.symbol}
        </Avatar>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        flexGrow={1}
        ml={2}
        pb={1}
        borderBottom={last ? undefined : '1px solid'}
        borderColor={last ? undefined : 'divider'}
        width={`calc(100% - 52px)`} // 36px (avatar) + 16px (gaps)
      >
        {/* Middle left side - Token info */}
        <Stack flexGrow={1} minWidth={0}>
          <Typography variant="body3" noWrap>
            {asset.name}
          </Typography>
          <Typography color="text.secondary" variant="body3" noWrap>
            {asset.balanceDisplayValue} {asset.symbol}
          </Typography>
        </Stack>

        <Stack
          justifyContent="space-between"
          alignItems="center"
          flexGrow={1}
          direction="row"
          columnGap={1.5}
        >
          <Box
            alignItems="flex-end"
            ml="auto"
            display="flex"
            justifyContent="flex-end"
          >
            <Stack alignItems="flex-end">
              <ProfitAndLoss
                // percentage={asset.priceChanges?.percentage}
                // value={asset.balanceCurrencyDisplayValue}
                asset={asset}
              />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};
