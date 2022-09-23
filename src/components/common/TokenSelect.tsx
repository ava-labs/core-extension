import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  VerticalFlex,
  HorizontalFlex,
  Typography,
  TokenSelector,
  BNInput,
  SearchInput,
  DropDownMenuItem,
  HorizontalSeparator,
} from '@avalabs/react-components';
import { TokenIcon } from '@src/components/common/TokenImage';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { ContainedDropdown } from '@src/components/common/ContainedDropdown';
import { AssetBalance } from '@src/pages/Bridge/models';
import { formatTokenAmount } from '@avalabs/bridge-sdk';
import EthLogo from '@src/images/tokens/eth.png';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { bnToLocaleString, numberToBN } from '@avalabs/utils-sdk';
import BN from 'bn.js';
import Big from 'big.js';

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
  z-index: 2;
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
  setIsOpen: (isOpen: boolean) => void;
  error?: string;
  margin?: string;
  padding?: string;
  label?: string;
  selectorLabel?: string;
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
  selectorLabel,
  isValueLoading,
  hideErrorMessage,
  onError,
  skipHandleMaxAmount,
  bridgeTokensList,
  setIsOpen,
}: TokenSelectProps) {
  const theme = useTheme();
  const { currencyFormatter, currency } = useSettingsContext();

  const selectButtonRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bnError, setBNError] = useState('');

  const [amountInCurrency, setAmountInCurrency] = useState<string>();

  const decimals = selectedToken?.decimals || 18;

  // Stringify maxAmount for referential equality in useEffect
  const maxAmountString = maxAmount
    ? bnToLocaleString(maxAmount, decimals)
    : null;
  const [isMaxAmount, setIsMaxAmount] = useState(false);

  const handleAmountChange = useCallback(
    ({ amount, bn }: { amount: string; bn: BN }) => {
      if (!maxAmountString) {
        onInputAmountChange && onInputAmountChange({ amount, bn });
        return;
      }
      setIsMaxAmount(maxAmountString === amount);
      onInputAmountChange && onInputAmountChange({ amount, bn });
    },
    [onInputAmountChange, maxAmountString]
  );
  const hideTokenDropdown = bridgeTokensList && bridgeTokensList.length < 2;

  useEffect(() => {
    const formattedAmount =
      inputAmount && !inputAmount.isZero() && selectedToken?.priceUSD
        ? currencyFormatter(
            Number(bnToLocaleString(inputAmount, decimals)) *
              selectedToken.priceUSD
          )
        : undefined;
    setAmountInCurrency(formattedAmount);
  }, [currencyFormatter, inputAmount, decimals, selectedToken?.priceUSD]);

  // When setting to the max, pin the input value to the max value
  useEffect(() => {
    if (!isMaxAmount || !maxAmountString || skipHandleMaxAmount) return;
    handleAmountChange({
      amount: maxAmountString,
      bn: numberToBN(maxAmountString, decimals),
    });
  }, [
    maxAmountString,
    handleAmountChange,
    isMaxAmount,
    skipHandleMaxAmount,
    decimals,
  ]);

  useEffect(() => {
    // when only one token is present, auto select it
    if (
      bridgeTokensList?.length === 1 &&
      bridgeTokensList[0] &&
      bridgeTokensList[0].asset.symbol !== selectedToken?.symbol
    ) {
      onTokenChange(bridgeTokensList[0]);
    }
    // when selected token is not supported, clear it
    else if (
      bridgeTokensList &&
      bridgeTokensList[0] &&
      selectedToken &&
      !bridgeTokensList
        .map((t) => t.symbolOnNetwork)
        .includes(selectedToken.symbol)
    ) {
      onTokenChange(bridgeTokensList[0]);
    }
  }, [bridgeTokensList, onTokenChange, selectedToken]);

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
          Balance: {selectedToken?.balanceDisplayValue ?? '0'}
        </Typography>
      </HorizontalFlex>
      <SelectContainer>
        <InputContainer
          data-testid="token-selector-dropdown"
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
                    icon: (
                      <TokenIcon
                        width="32px"
                        height="32px"
                        src={selectedToken?.logoUri}
                        name={selectedToken?.name}
                      />
                    ),
                  }
                : null
            }
            hideCaretIcon={hideTokenDropdown}
            label={selectorLabel ?? 'Select'}
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
            denomination={decimals}
            buttonContent={
              !isValueLoading &&
              maxAmount &&
              selectedToken?.balance &&
              selectedToken?.balance.gt(new BN(0))
                ? 'Max'
                : ''
            }
            data-testid="token-amount-input"
            placeholder="0"
            width="180px"
            height="40px"
            disabled={!selectedToken || isValueLoading}
            onChange={handleAmountChange}
            onClick={(e) => e.stopPropagation()}
            onError={(errorMessage) =>
              onError ? onError(errorMessage) : setBNError(errorMessage)
            }
            onKeyPress={preventMinus}
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
            <Typography size={12} color={theme.colors.text2}>
              {amountInCurrency ? (
                `${amountInCurrency.replace(currency, '')} ${currency}`
              ) : (
                <>&nbsp;</>
              )}
            </Typography>
          </HorizontalFlex>
        )}

        {!hideTokenDropdown && (
          <ContainedDropdown
            anchorEl={selectButtonRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            <DropdownContents>
              <HorizontalSeparator margin="0" />
              <SearchInputContainer>
                <StyledSearchInput
                  searchTerm={searchQuery}
                  data-testid="token-search-input"
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
                      .map((token, index) => (
                        <StyledDropdownMenuItem
                          data-testid={`token-search-menu-item-${index}`}
                          key={
                            token.type === TokenType.ERC20
                              ? token.address
                              : token.symbol
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
                              <TokenIcon
                                height="32px"
                                src={
                                  token.symbol === 'ETH'
                                    ? EthLogo
                                    : token.logoUri
                                }
                                name={token.name}
                              />
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
                      .map((token, index) => {
                        return (
                          <StyledDropdownMenuItem
                            data-testid={`token-bridge-menu-item-${index}`}
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
                                      : token.logoUri
                                  }
                                  name={token.asset.symbol}
                                />

                                <Typography
                                  size={16}
                                  height="24px"
                                  margin={'0 0 0 16px'}
                                  weight={500}
                                >
                                  {token.symbolOnNetwork || token.symbol}
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
        )}
      </SelectContainer>
    </VerticalFlex>
  );
}

function preventMinus(e) {
  if (e.code === 'Minus') {
    e.preventDefault();
  }
}
