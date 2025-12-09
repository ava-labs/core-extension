import {
  getUniqueTokenIdGeneric,
  TrendingToken,
  TrendingTokensNetwork,
} from '@core/types';
import { Avatar, Box, Button, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useSettingsContext } from '@core/ui';
import { formatCurrency } from '../../utils/formatAmount';
import upIcon from '../../assets/up.svg';
import downIcon from '../../assets/down.svg';
import { useHistory } from 'react-router-dom';
import { getSwapPath } from '@/config/routes';
import { TokenType } from '@avalabs/vm-module-types';
import { ChainId } from '@avalabs/core-chains-sdk';

type TokenCardProps = {
  token: TrendingToken;
  last: boolean;
  network: TrendingTokensNetwork;
};
const UNKNOWN_AMOUNT = '-';

const getCoreChainId = (network: TrendingTokensNetwork) => {
  if (network === 'avalanche') {
    return ChainId.AVALANCHE_MAINNET_ID;
  } else {
    return ChainId.SOLANA_MAINNET_ID;
  }
};

export const TokenCard = ({ token, last, network }: TokenCardProps) => {
  const rank = token.rank;
  const { currency } = useSettingsContext();
  const { t } = useTranslation();
  const { push } = useHistory();

  const [showBuyButton, setShowBuyButton] = useState(false);

  const formattedPercent = token.price24hChangePercent
    ? Math.abs(token.price24hChangePercent)?.toFixed(2).toString() + '%'
    : undefined;

  console.log({ token });
  const formattedPrice = token.price
    ? formatCurrency({
        amount: token.price,
        currency,
        boostSmallNumberPrecision: true,
      })
    : UNKNOWN_AMOUNT;

  const percentChangeIcon =
    token.price24hChangePercent && token.price24hChangePercent > 0
      ? upIcon
      : downIcon;

  const uniqueTokenId = useMemo(() => {
    // Normalize symbol and address to lowercase for ERC20 tokens to match getUniqueTokenId behavior
    // getUniqueTokenId lowercases symbols for EVM fungible tokens (ERC20)
    const isErc20 = !token.isNative;
    const normalizedSymbol = isErc20
      ? token.symbol.toLowerCase()
      : token.symbol;
    const normalizedAddress = isErc20
      ? token.address?.toLowerCase()
      : token.address;

    return getUniqueTokenIdGeneric({
      type: isErc20 ? TokenType.ERC20 : TokenType.NATIVE,
      symbol: normalizedSymbol,
      address: token.isNative ? undefined : normalizedAddress,
      coreChainId: getCoreChainId(network),
    });
  }, [token, network]);

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      pt={1}
      onMouseEnter={() => setShowBuyButton(true)}
      onMouseLeave={() => setShowBuyButton(false)}
    >
      {/* Left side - Avatar */}
      <Box position="relative" sx={{ transform: 'translateY(-4px)' }}>
        <Avatar
          alt={token.symbol}
          src={token.logoURI || undefined}
          sx={{ width: 36, height: 36 }}
        >
          {token.symbol}
        </Avatar>
        {rank === 1 && (
          <Box
            position="absolute"
            top={-16}
            right={-2}
            sx={{
              transform: 'rotate(25deg)',
              fontSize: '21px',
              zIndex: 1,
            }}
          >
            👑
          </Box>
        )}
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
            {rank}. {token.name}
          </Typography>
          <Typography color="text.secondary" variant="body3" noWrap>
            {token.symbol}
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
            <Box
              display={showBuyButton ? 'block' : 'none'}
              alignItems="flex-end"
            >
              <Button
                size="xsmall"
                variant="contained"
                color="secondary"
                onClick={() =>
                  push(
                    getSwapPath({
                      to: uniqueTokenId,
                    }),
                  )
                }
              >
                {t('Buy')}
              </Button>
            </Box>
            <Stack
              alignItems="flex-end"
              display={showBuyButton ? 'none' : 'flex'}
            >
              <Typography color="text.primary" variant="body3">
                {formattedPrice}
              </Typography>
              <Stack direction="row" gap={1}>
                <img src={percentChangeIcon} alt="percent change" />
                <Typography color="text.secondary" variant="body3">
                  {formattedPercent}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};
