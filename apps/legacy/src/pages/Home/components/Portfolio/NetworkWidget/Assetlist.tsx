import { TokenIcon } from '@/components/common/TokenIcon';
import { useAnalyticsContext, useNetworkContext } from '@core/ui';
import { useSettingsContext } from '@core/ui';
import { useSetSendDataInParams } from '@core/ui';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InlineTokenEllipsis } from '@/components/common/InlineTokenEllipsis';
import { TokenUnit } from '@avalabs/core-utils-sdk';
import {
  Button,
  ChevronRightIcon,
  Stack,
  Typography,
  keyframes,
  styled,
} from '@avalabs/core-k2-components';
import { TokenEllipsis } from '@/components/common/TokenEllipsis';
import { BalanceColumn } from '@/components/common/BalanceColumn';
import { PAndL } from '@/components/common/ProfitAndLoss';
import { hasUnconfirmedBalance } from '@core/common';
import { TokenType, TokenWithBalance } from '@avalabs/vm-module-types';
import { getUnconfirmedBalanceInCurrency } from '@core/types';

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
  const { network } = useNetworkContext();
  const maxAssetCount = 4;

  const setSendDataInParams = useSetSendDataInParams();
  const history = useHistory();

  const filteredAssetList = assetList
    .filter((asset) => getTokenVisibility(asset, network?.caipId))
    .sort((a, b) => (b.balanceInCurrency ?? 0) - (a.balanceInCurrency ?? 0));

  const restAssetCount = filteredAssetList.length - maxAssetCount;

  return (
    <>
      {filteredAssetList.slice(0, maxAssetCount).map((token) => {
        const totalBalance =
          token.balance && hasUnconfirmedBalance(token)
            ? new TokenUnit(
                token.balance + token.unconfirmedBalance,
                token.decimals,
                token.symbol,
              )
            : new TokenUnit(
                token.balance,
                'decimals' in token ? token.decimals : 0,
                token.symbol,
              );

        const balanceInCurrency = token.balanceInCurrency;

        return (
          <AssetlistRow
            data-testid={`${token.symbol.toLowerCase()}-token-list-row`}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            margin="0 -16px"
            padding="4px 16px"
            key={token.type === TokenType.NATIVE ? token.symbol : token.address}
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
                  {totalBalance.toDisplay()}{' '}
                  <InlineTokenEllipsis maxLength={8} text={token.symbol} />
                </Typography>
              </Stack>
            </Stack>
            <BalanceColumn className="balance-column">
              {typeof balanceInCurrency === 'number' && (
                <Typography
                  data-testid="token-row-currency-balance"
                  variant="caption"
                  sx={{ fontWeight: 'bold' }}
                >
                  {currencyFormatter(
                    balanceInCurrency +
                      (getUnconfirmedBalanceInCurrency(token) ?? 0),
                  )}
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
