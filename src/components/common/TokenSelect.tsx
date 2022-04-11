import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  Big,
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
import { TokenIcon } from '@src/components/common/TokenImage';
import {
  isERC20Token,
  TokenWithBalance,
} from '@avalabs/wallet-react-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';
import { AssetBalance } from '@src/pages/Bridge/models';
import { formatTokenAmount, useTokenInfoContext } from '@avalabs/bridge-sdk';
import EthLogo from '@src/images/tokens/eth.png';

function formatBalance(balance: Big | undefined) {
  return balance ? formatTokenAmount(balance, 6) : '-';
}

const InputContainer = styled(HorizontalFlex)`
  justify-content: space-between;
  align-items: center;
  padding: ${({ padding }) => padding ?? '8px 16px'};
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
  onTokenChange(token: TokenWithBalance | AssetBalance): void;
  maxAmount?: BN;
  inputAmount?: BN;
  onInputAmountChange?({ amount: string, bn: BN }): void;
  onSelectToggle?(): void;
  isOpen: boolean;
  error?: string;
  margin?: string;
  padding?: string;
  label?: string;
  tokensList?: TokenWithBalance[];
  bridgeTokensList?: AssetBalance[];
  isValueLoading?: boolean;
  hideErrorMessage?: boolean;
  onError?: (errorMessage: string) => void;
  skipHandleMaxAmount?: boolean;
}

export function TokenSelect({
  selectedToken,
  onTokenChange,
  tokensList,
  maxAmount,
  inputAmount,
  onInputAmountChange,
  onSelectToggle,
  isOpen,
  error,
  margin,
  padding,
  label,
  isValueLoading,
  hideErrorMessage,
  onError,
  skipHandleMaxAmount,
  bridgeTokensList,
}: TokenSelectProps) {
  const theme = useTheme();
  const { currencyFormatter, currency } = useSettingsContext();

  const selectButtonRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bnError, setBNError] = useState('');

  const [amountInCurrency, setAmountInCurrency] = useState<string>();
  const tokenInfoData = useTokenInfoContext();

  // Stringify maxAmount for referential equality in useEffect
  const maxAmountString = maxAmount ? bnToLocaleString(maxAmount, 18) : null;
  const [isMaxAmount, setIsMaxAmount] = useState(false);
  const handleAmountChange = useCallback(
    ({ amount, bn }: { amount: string; bn: BN }) => {
      if (!maxAmountString) {
        onInputAmountChange && onInputAmountChange({ amount, bn });
        return;
      }
      setIsMaxAmount(maxAmountString === amount);
      setAmountInCurrency(
        !bn.isZero() && selectedToken?.priceUSD
          ? currencyFormatter(
              Number(amount || 0) * (selectedToken?.priceUSD ?? 0)
            )
          : ''
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
    if (!isMaxAmount || !maxAmountString || skipHandleMaxAmount) return;
    handleAmountChange({
      amount: maxAmountString,
      bn: numberToBN(maxAmountString, 18),
    });
  }, [maxAmountString, handleAmountChange, isMaxAmount, skipHandleMaxAmount]);

  return (
    <VerticalFlex width="100%" style={{ margin }}>
      <HorizontalFlex
        justify="space-between"
        align="flex-end"
        margin={!padding ? '0 0 8px' : '0'}
        grow="1"
        padding={padding}
      >
        <Typography size={12} color={theme.inputs.colorLabel}>
          {label ?? 'Token'}
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
          padding={padding}
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
            value={
              isMaxAmount && !skipHandleMaxAmount
                ? maxAmount || inputAmount
                : inputAmount
            }
            max={
              !isValueLoading ? maxAmount || selectedToken?.balance : undefined
            }
            denomination={selectedToken?.denomination || 9}
            buttonContent={
              !isValueLoading &&
              maxAmount &&
              selectedToken?.balance &&
              selectedToken?.balance.gt(new BN(0))
                ? 'Max'
                : ''
            }
            placeholder={'0.0'}
            width="180px"
            height="40px"
            disabled={!selectedToken || isValueLoading}
            onChange={handleAmountChange}
            onClick={(e) => e.stopPropagation()}
            onError={(errorMessage) =>
              onError ? onError(errorMessage) : setBNError(errorMessage)
            }
            style={{ borderWidth: 0, backgroundColor: theme.colors.bg3 }}
            hideErrorMessage
            isValueLoading={isValueLoading}
          />
        </InputContainer>
        {!hideErrorMessage && (
          <HorizontalFlex
            justify="space-between"
            grow="1"
            margin={!padding ? '4px 0 0 0' : '0'}
            padding={padding}
          >
            <Typography size={12} color={theme.colors.error}>
              {bnError || error}
            </Typography>
            {amountInCurrency && (
              <Typography size={12} color={theme.colors.text2}>
                {amountInCurrency} {currency}
              </Typography>
            )}
            {!amountInCurrency && inputAmount && (
              <Typography size={12} color={theme.colors.text2}>
                {currencyFormatter(
                  Number(
                    bnToLocaleString(
                      inputAmount,
                      selectedToken?.denomination
                    ) || 0
                  ) * (selectedToken?.priceUSD ?? 0)
                )}{' '}
                {currency}
              </Typography>
            )}
          </HorizontalFlex>
        )}

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
                {tokensList &&
                  tokensList
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
                {bridgeTokensList &&
                  bridgeTokensList
                    .filter((token) =>
                      searchQuery.length
                        ? token.symbol
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : true
                    )
                    .map((token) => {
                      return (
                        <StyledDropdownMenuItem
                          key={token.symbol}
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
                              <TokenIcon
                                width="32px"
                                height="32px"
                                src={
                                  token.symbol === 'ETH'
                                    ? EthLogo
                                    : tokenInfoData?.[token.symbol]?.logo
                                }
                                name={token.asset.symbol}
                              />

                              <Typography
                                size={16}
                                height="24px"
                                margin={'0 0 0 16px'}
                                weight={500}
                              >
                                {token.asset.tokenName || token.symbol}
                              </Typography>
                            </HorizontalFlex>
                            <Typography size={14} height="24px">
                              {formatBalance(token.balance)} {token.symbol}
                            </Typography>
                          </HorizontalFlex>
                        </StyledDropdownMenuItem>
                      );
                    })}
              </Scrollbars>
            </VerticalFlex>
          </DropdownContents>
        </ContainedDropdown>
      </SelectContainer>
    </VerticalFlex>
  );
}
