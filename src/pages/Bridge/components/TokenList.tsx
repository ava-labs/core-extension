import { useMemo } from 'react';
import { Big } from '@avalabs/avalanche-wallet-sdk';
import { TokenCard, VerticalFlex } from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { formatTokenAmount, useTokenInfoContext } from '@avalabs/bridge-sdk';
import EthLogo from './../../../images/tokens/eth.png';

interface TokenListProps {
  searchQuery?: string;
  onClick: any;
  onClose: any;
  tokenList: any;
}

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

export function TokenList({
  tokenList,
  searchQuery,
  onClick,
  onClose,
}: TokenListProps) {
  const tokenInfoData = useTokenInfoContext();
  const { currency, currencyFormatter } = useSettingsContext();
  const { tokens } = useMemo(() => {
    const tokens = searchQuery
      ? tokenList.filter(
          (i) =>
            i.asset.tokenName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            i.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tokenList;

    return { tokens };
  }, [tokenList, searchQuery]);

  if (!tokens.length) {
    return null;
  }

  return (
    <VerticalFlex grow="1" padding="16px 0 0 0">
      <Scrollbars>
        <VerticalFlex padding="0px 16px 0px">
          {tokens.map((token, index) => {
            return (
              <TokenCard
                name={
                  token.symbol === 'ETH' ? 'Ethereum' : token.asset.tokenName
                }
                symbol={token.symbol}
                onClick={() => {
                  onClick(token.symbol);
                  onClose();
                }}
                currency={currency}
                balanceDisplayValue={formatBalance(token.balance)}
                balanceUSD={token.balanceUSD?.toString()}
                currencyFormatter={currencyFormatter}
                key={`${token.asset.tokenName}-${token.symbol}-${index}`}
              >
                <TokenIcon
                  width="32px"
                  height="32px"
                  src={
                    token.symbol === 'ETH'
                      ? EthLogo
                      : tokenInfoData?.[token.symbol]?.logo
                  }
                  name={token.asset.tokenName}
                />
              </TokenCard>
            );
          })}
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
