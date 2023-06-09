import { useMemo } from 'react';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { TokenListItem } from './TokenListItem';
import { WalletIsEmpty } from './WalletIsEmpty';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useIsFunctionAvailable } from '@src/hooks/useIsFunctionUnavailable';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { getNetworkBalance } from './NetworkWidget/NetworksWidget';
import { TokenType } from '@src/background/services/balances/models';
import { useTranslation } from 'react-i18next';
import { AutoSizer } from 'react-virtualized';
import VirtualizedList from '@src/components/common/VirtualizedList';
import {
  Button,
  ChevronLeftIcon,
  Stack,
  Typography,
  styled,
} from '@avalabs/k2-components';
import { TokenIconK2 } from '@src/components/common/TokenImageK2';

const LogoContainer = styled('div')`
  margin: 0 15px 0 8px;
`;

const TokenRow = styled('div')`
  padding: 0 10px 0 16px;
`;

interface TokenListProps {
  searchQuery?: string;
}

export function TokenList({ searchQuery }: TokenListProps) {
  const { t } = useTranslation();
  const { getTokenVisibility, currencyFormatter } = useSettingsContext();
  const tokensWithBalances = useTokensWithBalances();
  const history = useHistory();
  const setSendDataInParams = useSetSendDataInParams();
  const { capture } = useAnalyticsContext();
  const { checkIsFunctionAvailable } = useIsFunctionAvailable();
  const { network } = useNetworkContext();
  const activeNetworkAssetList = useTokensWithBalances();

  const activeNetworkBalance = getNetworkBalance(activeNetworkAssetList);

  const tokens = useMemo(
    () =>
      (searchQuery
        ? tokensWithBalances.filter(
            (token) =>
              getTokenVisibility(token) &&
              (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : tokensWithBalances
      )
        .filter((token) => getTokenVisibility(token))
        .sort((a, b) => (b.balanceUSD ?? 0) - (a.balanceUSD ?? 0)),
    [searchQuery, tokensWithBalances, getTokenVisibility]
  );

  const toggleManageTokensPage = () => {
    if (history.location.pathname.startsWith('/manage-tokens')) {
      history.push('/');
      return;
    }
    history.push('/manage-tokens');
  };

  function rowRenderer({ key, index, style }) {
    const token = tokens[index];
    if (!token) {
      // Token should be truthy and should not get here. Just adding this to not break the list if this happens. This will make the row just empty.
      return <div style={style} key={key}></div>;
    }
    return (
      <TokenRow style={style} key={key}>
        <TokenListItem
          data-testid={`${token.symbol}-token-list-item-test2`}
          onClick={() => {
            setSendDataInParams({
              token: token,
              options: { path: '/token' },
            });
            capture('TokenListTokenSelected', {
              selectedToken:
                token.type === TokenType.ERC20 ? token.address : token.symbol,
            });
          }}
          name={token.name}
          symbol={token.symbol}
          balanceDisplayValue={token.balanceDisplayValue}
          balanceUSD={token.balanceUSD?.toString()}
        >
          <TokenIconK2
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
    <Stack sx={{ flexGrow: 1, mt: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          width: '100%',
          mt: 2,
          py: '12px',
          px: 2,
        }}
      >
        <Stack direction="row" alignItems="center">
          <ChevronLeftIcon
            onClick={() => history.push('/home')}
            size={30}
            sx={{ cursor: 'pointer' }}
          />
          <LogoContainer>
            <TokenIconK2
              width="40px"
              height="40px"
              src={network?.logoUri}
              name={network?.chainName}
            />
          </LogoContainer>
          <Stack>
            <Typography variant="h4">{network?.chainName}</Typography>
            <Typography variant="body1">
              {currencyFormatter(activeNetworkBalance)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          mx: 2,
          mb: 1,
        }}
      >
        {checkIsFunctionAvailable('ManageTokens') && tokens.length && (
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
      <Stack>
        {tokens.length && (
          <AutoSizer>
            {({ width }) => (
              <VirtualizedList
                height={391}
                rowCount={tokens.length}
                rowHeight={72}
                rowRenderer={rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}

        {tokens.length === 0 && <WalletIsEmpty />}
      </Stack>
    </Stack>
  );
}
