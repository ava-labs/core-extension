import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  BN,
  bnToLocaleString,
  numberToBN,
} from '@avalabs/avalanche-wallet-sdk';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
  TokenSelector,
  BNInput,
  SearchInput,
  DropDownMenuItem,
  HorizontalSeparator,
  AvaxTokenIcon,
} from '@avalabs/react-components';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { TokenIcon } from '@src/components/common/TokenImage';
import {
  isERC20Token,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';

const InputContainer = styled(HorizontalFlex)`
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: ${({ theme }) => theme.swapCard.inputContainerBg};
  cursor: pointer;
`;

const SelectContainer = styled.div`
  position: relative;
`;

const DropdownContents = styled(VerticalFlex)`
  flex-grow: 1;
  background: ${({ theme }) => theme.swapCard.inputContainerBg};
  border-radius: 0 0 8px 8px;
`;

const SearchInputContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
`;

const StyledSearchInput = styled(SearchInput)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const StyledDropdownMenuItem = styled(DropDownMenuItem)`
  padding: 8px 16px;
`;

interface TokenSelectProps {
  selectedToken?: TokenWithBalance | null;
  onTokenChange(token: TokenWithBalance): void;
  maxAmount: BN;
  inputAmount?: BN;
  onInputAmountChange?({ amount: string, bn: BN }): void;
  onSelectToggle?(): void;
  isOpen: boolean;
  error?: string;
  margin: string;
}

export function TokenSelect({
  selectedToken,
  onTokenChange,
  maxAmount,
  inputAmount,
  onInputAmountChange,
  onSelectToggle,
  isOpen,
  error,
  margin,
}: TokenSelectProps) {
  const theme = useTheme();
  const tokensWBalances = useTokensWithBalances(false);
  const { currencyFormatter, currency } = useSettingsContext();

  const selectButtonRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bnError, setBNError] = useState('');

  const [amountInCurrency, setAmountInCurrency] = useState<string>();
  // Stringify maxAmount for referential equality in useEffect
  const maxAmountString = bnToLocaleString(maxAmount, 18);
  const [isMaxAmount, setIsMaxAmount] = useState(false);
  const handleAmountChange = useCallback(
    ({ amount, bn }: { amount: string; bn: BN }) => {
      setIsMaxAmount(maxAmountString === amount);
      setAmountInCurrency(
        !bn.isZero() && selectedToken?.priceUSD
          ? currencyFormatter(
              Number(amount || 0) * (selectedToken?.priceUSD ?? 0)
            )
          : undefined
      );
      onInputAmountChange && onInputAmountChange({ amount, bn });
    },
    [
      currencyFormatter,
      onInputAmountChange,
      selectedToken?.priceUSD,
      maxAmountString,
    ]
  );

  // When setting to the max, pin the input value to the max value
  useEffect(() => {
    if (!isMaxAmount) return;
    handleAmountChange({
      amount: maxAmountString,
      bn: numberToBN(maxAmountString, 18),
    });
  }, [maxAmountString, handleAmountChange, isMaxAmount]);

  return (
    <VerticalFlex width="100%" style={{ margin, padding: '0 16px' }}>
      <HorizontalFlex
        justify="space-between"
        align="flex-end"
        margin="0 0 8px"
        grow="1"
      >
        <Typography size={14} color={theme.inputs.colorLabel}>
          Token
        </Typography>
        <Typography size={12} color={theme.colors.text2}>
          {selectedToken?.balanceDisplayValue &&
            selectedToken &&
            `Balance: ${selectedToken.balanceDisplayValue} ${selectedToken.symbol}`}
        </Typography>
      </HorizontalFlex>
      <SelectContainer>
        <InputContainer
          ref={selectButtonRef}
          style={{ borderRadius: isOpen ? '8px 8px 0 0' : 8 }}
          onClick={() => onSelectToggle && onSelectToggle()}
        >
          <TokenSelector
            isOpen={isOpen}
            token={
              selectedToken
                ? {
                    name: selectedToken?.symbol,
                    icon: selectedToken?.isAvax ? (
                      <AvaxTokenIcon height="32px" />
                    ) : (
                      <TokenIcon
                        width="32px"
                        height="32px"
                        src={selectedToken?.logoURI}
                        name={selectedToken?.name}
                      />
                    ),
                  }
                : null
            }
          />
          <BNInput
            value={isMaxAmount ? maxAmount || inputAmount : inputAmount}
            max={maxAmount || selectedToken?.balance}
            denomination={selectedToken?.denomination || 9}
            buttonContent={selectedToken?.balance.gt(new BN(0)) ? 'Max' : ''}
            placeholder={'0.0'}
            width="180px"
            height="40px"
            disabled={!selectedToken}
            onChange={handleAmountChange}
            onClick={(e) => e.stopPropagation()}
            onError={(errorMessage) => setBNError(errorMessage)}
            style={{ borderWidth: 0, backgroundColor: theme.colors.bg3 }}
            hideErrorMessage
          />
        </InputContainer>
        <HorizontalFlex justify="space-between" grow="1" margin="4px 0 0 0">
          <Typography size={12} color={theme.colors.error}>
            {bnError || error}
          </Typography>
          {amountInCurrency && (
            <Typography size={12} color={theme.colors.text2}>
              {amountInCurrency} {currency}
            </Typography>
          )}
        </HorizontalFlex>

        <ContainedDropdown anchorEl={selectButtonRef} isOpen={isOpen}>
          <DropdownContents>
            <HorizontalSeparator margin="0" />
            <SearchInputContainer>
              <StyledSearchInput
                searchTerm={searchQuery}
                placeholder="Search"
                width="100%"
                onSearch={(term) => setSearchQuery(term)}
                autoFocus={true}
              />
            </SearchInputContainer>
            <VerticalFlex grow="1">
              <Scrollbars>
                {tokensWBalances
                  .filter((token) =>
                    searchQuery.length
                      ? token.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        token.symbol
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((token) => (
                    <StyledDropdownMenuItem
                      key={
                        isERC20Token(token)
                          ? token.address
                          : (token as any).symbol
                      }
                      onClick={() => {
                        onTokenChange(token);
                        onSelectToggle && onSelectToggle();
                      }}
                    >
                      <HorizontalFlex
                        justify="space-between"
                        align="center"
                        grow="1"
                      >
                        <HorizontalFlex align="center">
                          {token?.isAvax ? (
                            <AvaxTokenIcon height="32px" />
                          ) : (
                            <TokenIcon
                              height="32px"
                              src={token.logoURI}
                              name={token.name}
                            />
                          )}
                          <Typography
                            size={16}
                            height="24px"
                            margin={'0 0 0 16px'}
                            weight={500}
                          >
                            {token.name}
                          </Typography>
                        </HorizontalFlex>
                        <Typography size={14} height="24px">
                          {token.balanceDisplayValue} {token.symbol}
                        </Typography>
                      </HorizontalFlex>
                    </StyledDropdownMenuItem>
                  ))}
              </Scrollbars>
            </VerticalFlex>
          </DropdownContents>
        </ContainedDropdown>
      </SelectContainer>
    </VerticalFlex>
  );
}
