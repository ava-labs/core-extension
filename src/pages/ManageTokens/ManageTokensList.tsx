import {
  HorizontalFlex,
  SubTextTypography,
  Toggle,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import {
  isERC20Token,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';

type ManageTokensListProps = {
  searchQuery: string;
};

export const ManageTokensList = ({ searchQuery }: ManageTokensListProps) => {
  const tokensWithBalances = useTokensWithBalances();

  return (
    <>
      {tokensWithBalances
        .filter(
          (token) =>
            !token.isAvax &&
            (searchQuery.length
              ? token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
              : true)
        )
        .map((token) => (
          <ManageTokensListItem
            key={isERC20Token(token) ? token.address : token.symbol}
            token={token}
          />
        ))}
    </>
  );
};

type ManageTokensListItemProps = {
  token: TokenWithBalance;
};

const ManageTokensListItem = ({ token }: ManageTokensListItemProps) => {
  const { getTokenVisibility, toggleTokenVisibility } = useSettingsContext();

  return (
    <HorizontalFlex
      width="100%"
      justify="space-between"
      align="center"
      margin="0 0 16px 0"
    >
      <HorizontalFlex align="center">
        <TokenIcon
          width="32px"
          height="32px"
          src={token.logoURI}
          name={token.name}
        />
        <VerticalFlex margin={'0 16px'}>
          <Typography size={16} margin={'0 0 4px 0'} height="24px" weight={500}>
            {token.name}
          </Typography>
          <SubTextTypography size={14} height="17px">
            {token.symbol}
          </SubTextTypography>
        </VerticalFlex>
      </HorizontalFlex>
      <Toggle
        isChecked={getTokenVisibility(token)}
        onChange={() => toggleTokenVisibility(token)}
      />
    </HorizontalFlex>
  );
};
