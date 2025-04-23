import {
  Card,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import {
  TokenType,
  type ERC1155Token,
  type ERC721Token,
  type NetworkContractToken,
  type NetworkToken,
  type TokenDiffItem,
} from '@avalabs/vm-module-types';
import { TokenIcon } from 'packages/ui/src/components/common/TokenIcon';
import { CollectibleMedia } from 'packages/ui/pages/Collectibles/components/CollectibleMedia';
import { useConvertedCurrencyFormatter } from 'packages/ui/pages/DeFi/hooks/useConvertedCurrencyFormatter';
import { useEffect, useRef, useState } from 'react';

export enum TransactionTokenCardVariant {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  DEFAULT = 'DEFAULT',
}

const isNftToken = (
  token: NetworkToken | NetworkContractToken,
): token is ERC721Token | ERC1155Token =>
  'type' in token &&
  (token.type === TokenType.ERC1155 || token.type === TokenType.ERC721);

export const TransactionTokenCard = ({
  token,
  diffItem,
  variant = TransactionTokenCardVariant.DEFAULT,
  sx = {},
}: {
  token: NetworkToken | NetworkContractToken;
  variant?: TransactionTokenCardVariant;
  diffItem: TokenDiffItem;
  sx?: SxProps<Theme>;
}) => {
  const currencyFormatter = useConvertedCurrencyFormatter();
  const [hasNameOverflow, setHasNameOverflow] = useState(false);

  const overflowingText = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (checkOverflow(overflowingText.current)) {
      setHasNameOverflow(true);
      return;
    }
    setHasNameOverflow(false);
  }, [overflowingText]);

  const checkOverflow = (textContainer: HTMLSpanElement | null): boolean => {
    if (textContainer) {
      return (
        textContainer.offsetHeight < textContainer.scrollHeight ||
        textContainer.offsetWidth < textContainer.scrollWidth
      );
    }
    return false;
  };

  const amountColor =
    variant === TransactionTokenCardVariant.SEND
      ? 'error.light'
      : variant === TransactionTokenCardVariant.RECEIVE
        ? 'success.light'
        : 'text.primary';

  return (
    <Card
      sx={{
        py: '10px',
        px: 2,
        borderRadius: '10px',
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Stack direction="row" sx={{ flex: 0 }}>
          {isNftToken(token) ? (
            <CollectibleMedia
              height="32px"
              width="auto"
              maxWidth="32px"
              url={token.logoUri}
              hover={false}
              margin="8px 0"
              showPlayIcon={false}
            />
          ) : (
            <TokenIcon
              width="32px"
              height="32px"
              src={token.logoUri}
              name={token.name}
            />
          )}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ ml: 2, width: '100%' }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Tooltip
              placement="bottom"
              title={<Typography variant="caption">{token.name}</Typography>}
              disableHoverListener={!hasNameOverflow}
              disableFocusListener={!hasNameOverflow}
              sx={{
                flex: 1,
                width: 0,
                flexDirection: 'column',
              }}
            >
              <>
                <Typography
                  ref={overflowingText}
                  variant="h6"
                  fontWeight="fontWeightSemibold"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {token.name}
                </Typography>
              </>
            </Tooltip>
          </Stack>

          <Stack alignItems="flex-end">
            <Stack direction="row" alignItems="flex-end">
              <Tooltip
                placement="bottom"
                title={
                  <Typography variant="caption">
                    {variant === TransactionTokenCardVariant.SEND ? '-' : ''}
                    {diffItem.displayValue} {token.symbol}
                  </Typography>
                }
              >
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      color: amountColor,
                      maxWidth: '120px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {variant === TransactionTokenCardVariant.SEND ? '-' : ''}
                    {diffItem.displayValue}
                  </Typography>
                  {'symbol' in token && (
                    <Typography
                      variant="body2"
                      sx={{
                        ml: diffItem.displayValue !== undefined ? 0.4 : 0,
                        color: amountColor,
                      }}
                    >
                      {token.symbol}
                    </Typography>
                  )}
                </>
              </Tooltip>
            </Stack>

            {diffItem.usdPrice && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {currencyFormatter
                  ? currencyFormatter(Number(diffItem.usdPrice))
                  : diffItem.usdPrice}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};
