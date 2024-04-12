import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InlineTokenEllipsis } from '@src/components/common/InlineTokenEllipsis';
import { balanceToDisplayValue } from '@avalabs/utils-sdk';
import {
  Button,
  ChevronRightIcon,
  Stack,
  Typography,
  keyframes,
  styled,
} from '@avalabs/k2-components';
import { TokenEllipsis } from '@src/components/common/TokenEllipsis';
import { BalanceColumn } from '@src/components/common/BalanceColumn';
import { PAndL } from '@src/components/common/ProfitAndLoss';

interface AssetListProps {
  assetList: TokenWithBalance[];
}

const ShowAnimation = keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

const HideAnimation = keyframes`
0% {
  opacity: 1;
}
100% {
  opacity: 0;
}
`;

const BalanceUSDField = styled(Typography)`
  font-weight: bold;
`;
const BalanceField = styled(Typography)`
  font-weight: bold;
  display: none;
`;

const AssetlistRow = styled(Stack)`
  &:hover {
    background-color: ${({ theme }) => `${theme.palette.common.white}40`};
    > .balance-column > .balance {
      display: block;
      animation: 0.3s ease-in-out ${ShowAnimation};
    }
    > .balance-column > .balance-usd {
      display: none;
      animation: 0.3s ease-in-out ${HideAnimation};
    }
  }
`;

export function Assetlist({ assetList }: AssetListProps) {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const { currencyFormatter, getTokenVisibility } = useSettingsContext();
  const maxAssetCount = 4;

  const setSendDataInParams = useSetSendDataInParams();
  const history = useHistory();

  const filteredAssetList = assetList
    .filter((asset) => getTokenVisibility(asset))
    .sort((a, b) => (b.balanceUSD ?? 0) - (a.balanceUSD ?? 0));

  const restAssetCount = filteredAssetList.length - maxAssetCount;

  return (
    <>
      {filteredAssetList.slice(0, maxAssetCount).map((token) => {
        return (
          <AssetlistRow
            data-testid={`${token.symbol.toLowerCase()}-token-list-row`}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            margin="0 -16px"
            padding="4px 16px"
            key={token.symbol}
            onClick={(e) => {
              e.stopPropagation();
              capture('PortfolioTokenSelected', {
                selectedToken:
                  token.type === TokenType.ERC20 ? token.address : token.symbol,
              });
              setSendDataInParams({
                token: token,
                options: { path: '/token' },
              });
            }}
          >
            <Stack direction="row" alignItems="center">
              <TokenIcon
                width="24px"
                height="24px"
                src={token.logoUri}
                name={token.name}
              />
              <Stack sx={{ ml: 1 }}>
                <Typography data-testid="token-row-name" variant="button">
                  <TokenEllipsis maxLength={12} text={token.name} />
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  <TokenEllipsis maxLength={8} text={token.symbol} />
                </Typography>
              </Stack>
            </Stack>
            <BalanceColumn className="balance-column">
              {!!token.balanceUSD && (
                <>
                  <BalanceUSDField
                    className="balance-usd"
                    data-testid="token-row-currency-balance"
                    variant="caption"
                  >
                    {currencyFormatter(
                      token.balanceUSD + (token.unconfirmedBalanceUSD || 0)
                    )}
                  </BalanceUSDField>
                  <BalanceField
                    className="balance"
                    data-testid="token-row-token-balance"
                    variant="caption"
                  >
                    {token.balance && token.unconfirmedBalance
                      ? balanceToDisplayValue(
                          token.balance.add(token.unconfirmedBalance),
                          token.decimals
                        )
                      : token.balanceDisplayValue}{' '}
                    <InlineTokenEllipsis maxLength={8} text={token.symbol} />
                  </BalanceField>
                </>
              )}
              {!token.balanceUSD && (
                <Typography variant="caption">
                  {token.balance && token.unconfirmedBalance
                    ? balanceToDisplayValue(
                        token.balance.add(token.unconfirmedBalance),
                        token.decimals
                      )
                    : token.balanceDisplayValue}{' '}
                  <InlineTokenEllipsis maxLength={8} text={token.symbol} />
                </Typography>
              )}
              <Stack>
                {token.priceChanges &&
                token.priceChanges.value &&
                token.priceChanges.percentage ? (
                  <PAndL
                    value={token.priceChanges.value}
                    percentage={token.priceChanges.percentage}
                  />
                ) : null}
              </Stack>
            </BalanceColumn>
          </AssetlistRow>
        );
      })}
      <Stack direction="row" justifyContent="flex-end">
        {restAssetCount > 0 && (
          <Button
            variant="text"
            onClick={() => history.push('/assets')}
            sx={{ mt: 1, color: 'seconday.main', p: 0 }}
          >
            <Stack
              direction="row"
              alignContent="center"
              sx={{ columnGap: '10px' }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 'fontWeightSemibold' }}
              >
                {t('+{{restAssetCount}} more', { restAssetCount })}
              </Typography>
              <ChevronRightIcon size={16} />
            </Stack>
          </Button>
        )}
      </Stack>
    </>
  );
}
