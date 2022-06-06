import {
  HorizontalFlex,
  TextButton,
  Typography,
} from '@avalabs/react-components';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useSetSendDataInParams } from '@src/hooks/useSetSendDataInParams';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

interface AssetListProps {
  assetList: TokenWithBalance[];
}

const AssetlistRow = styled(HorizontalFlex)`
  &:hover {
    background-color: ${({ theme }) => `${theme.palette.white}40`};
  }
`;

export function Assetlist({ assetList }: AssetListProps) {
  const tokensWithBalances = useTokensWithBalances();
  const { currencyFormatter } = useSettingsContext();
  const theme = useTheme();
  const maxAssetCount = 4;

  const restAssetCount = tokensWithBalances.length - maxAssetCount;
  const setSendDataInParams = useSetSendDataInParams();
  const history = useHistory();

  return (
    <>
      {assetList.slice(0, maxAssetCount).map((token) => {
        return (
          <AssetlistRow
            align="center"
            justify="space-between"
            margin="0 -16px"
            padding="4px 16px"
            key={token.symbol}
            onClick={() =>
              setSendDataInParams({
                token: token,
                options: { path: '/token' },
              })
            }
          >
            <HorizontalFlex align="center">
              <TokenIcon
                width="16px"
                height="16px"
                src={token.logoUri}
                name={token.name}
              />
              <Typography
                margin="0 0 0 8px"
                color={theme.colors.text1}
                size={12}
              >
                {token.name}
              </Typography>
              <Typography
                margin="0 0 0 4px"
                color={theme.colors.text2}
                size={12}
              >
                {token.symbol}
              </Typography>
            </HorizontalFlex>
            <Typography color={theme.colors.text1} size={12}>
              {currencyFormatter(token.balanceUSD || 0)}
            </Typography>
          </AssetlistRow>
        );
      })}
      <HorizontalFlex justify="flex-end">
        {restAssetCount > 0 && (
          <TextButton
            onClick={() => history.push('/tokenlist')}
            margin="8px 0 0 0"
          >
            + {restAssetCount} more
          </TextButton>
        )}
      </HorizontalFlex>
    </>
  );
}
