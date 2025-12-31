import { useMemo } from 'react';
import { useNetworkContext, useTokensWithBalances } from '@core/ui';
import { useSetSendDataInParams } from '@core/ui';
import { TokenListItem } from './TokenListItem';
import { WalletIsEmpty } from './WalletIsEmpty';
import { useSettingsContext } from '@core/ui';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@core/ui';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { AutoSizer } from 'react-virtualized';
import VirtualizedList from '@/components/common/VirtualizedList';
import { Button, Stack, styled } from '@avalabs/core-k2-components';
import { TokenIcon } from '@/components/common/TokenIcon';
import { normalizeBalance } from '@core/common';
import Big from 'big.js';
import { TokenType } from '@avalabs/vm-module-types';
import { isTokenMalicious } from '@core/common';

const TokenRow = styled('div')`
  padding: 0 10px 0 16px;
`;

interface TokenListProps {
  searchQuery?: string;
}

export function TokenList({ searchQuery }: TokenListProps) {
  const { t } = useTranslation();
  const { getTokenVisibility } = useSettingsContext();
  const tokensWithBalances = useTokensWithBalances();
  const history = useHistory();
  const setSendDataInParams = useSetSendDataInParams();
  const { capture } = useAnalyticsContext();
  const { isFunctionSupported: isManageTokenSupported } =
    useIsFunctionAvailable({ functionName: FunctionNames.MANAGE_TOKEN });
  const { network } = useNetworkContext();

  const firstAsset = tokensWithBalances[0];
  const firstAssetBalance =
    firstAsset && 'decimals' in firstAsset
      ? (normalizeBalance(firstAsset.balance, firstAsset.decimals) ??
        new Big(0))
      : new Big(0);
  const hasNoFunds =
    tokensWithBalances.length === 1 && firstAssetBalance.eq(new Big(0));

  const tokens = useMemo(
    () =>
      (searchQuery
        ? tokensWithBalances.filter(
            (token) =>
              getTokenVisibility(token, network?.caipId) &&
              (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase())),
          )
        : tokensWithBalances
      )
        .filter((token) => getTokenVisibility(token, network?.caipId))
        .sort(
          (a, b) => (b.balanceInCurrency ?? 0) - (a.balanceInCurrency ?? 0),
        ),
    [searchQuery, tokensWithBalances, getTokenVisibility, network],
  );

  const toggleManageTokensPage = () => {
    if (history.location.pathname.startsWith('/manage-tokens')) {
      history.push('/');
      return;
    }
    history.push('/manage-tokens');
  };

  function rowRenderer({ index, style }) {
    const token = tokens[index];
    if (!token) {
      // Token should be truthy and should not get here. Just adding this to not break the list if this happens. This will make the row just empty.
      return <div style={style}></div>;
    }
    return (
      <TokenRow style={style}>
        <TokenListItem
          data-testid={`${token.symbol}-token-list-item-test2`}
          onClick={() => {
            setSendDataInParams({
              token: token,
              options: { path: '/token' },
            });
            capture('TokenListTokenSelected', {
              selectedToken:
                token.type === TokenType.ERC20 || token.type === TokenType.SPL
                  ? token.address
                  : token.symbol,
            });
          }}
          name={token.name}
          symbol={token.symbol}
          balanceDisplayValue={token.balanceDisplayValue}
          balanceInCurrency={token.balanceInCurrency?.toString()}
          priceChanges={token.priceChanges}
          isMalicious={isTokenMalicious(token)}
        >
          <TokenIcon
            width="32px"
            height="32px"
            src={token.logoUri}
            name={token.name}
          />
        </TokenListItem>
      </TokenRow>
    );
  }

  return (
    <Stack sx={{ flexGrow: 1, overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          mx: 2,
          my: 1,
        }}
      >
        {isManageTokenSupported && tokens.length && (
          <Button
            variant="text"
            size="small"
            data-testid="manage-tokens-button"
            onClick={toggleManageTokensPage}
            sx={{ cursor: 'pointer' }}
          >
            {t('Manage')}
          </Button>
        )}
      </Stack>
      <Stack sx={{ flexGrow: 1 }}>
        {hasNoFunds ? (
          <WalletIsEmpty />
        ) : (
          <AutoSizer>
            {({ width, height }) => (
              <VirtualizedList
                height={height}
                itemCount={tokens.length}
                itemSize={72}
                width={width}
              >
                {rowRenderer}
              </VirtualizedList>
            )}
          </AutoSizer>
        )}
      </Stack>
    </Stack>
  );
}
