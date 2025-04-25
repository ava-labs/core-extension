import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSettingsContext } from '@/contexts/SettingsProvider';
import { ContainedDropdown } from '@/components/common/ContainedDropdown';
import EthLogo from '@/images/tokens/eth.png';
import {
  hasUnconfirmedBTCBalance,
  isAvaxWithUnavailableBalance,
} from '@core/service-worker';
import { bigToLocaleString, TokenUnit } from '@avalabs/core-utils-sdk';
import { useTranslation } from 'react-i18next';
import { BalanceColumn } from '@/components/common/BalanceColumn';
import { AutoSizer } from 'react-virtualized';
import VirtualizedList from './VirtualizedList';
import {
  InfoCircleIcon,
  Stack,
  Tooltip,
  styled,
  Typography,
  Divider,
  Card,
  SearchBar,
} from '@avalabs/core-k2-components';
import { BNInput } from '@/components/common/BNInput';
import { TokenSelector } from './TokenSelector';
import { TokenEllipsis } from './TokenEllipsis';
import { DropdownItem } from './Dropdown';
import { useDisplaytokenlist } from '@/hooks/useDisplayTokenList';
import { TokenIcon } from './TokenIcon';
import { TokenWithBalance } from '@avalabs/vm-module-types';
import { bigintToBig } from '@core/utils';
import { stringToBigint } from '@core/utils';

const InputContainer = styled(Card)`
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: ${({ theme }) => theme.palette.grey[850]};
  display: flex;
`;

const SelectContainer = styled(Stack)`
  position: relative;
`;

const DropdownContents = styled(Stack)`
  flex-grow: 1;
  background: ${({ theme }) => theme.palette.grey[850]};
  border-radius: 0 0 8px 8px;
  z-index: 2;
`;

const SearchInputContainer = styled(Stack)`
  padding-left: 16px;
  padding-right: 16px;
`;

const StyledDropdownMenuItem = styled(DropdownItem)`
  padding: 8px 16px;
`;

interface TokenSelectProps {
  selectedToken?: TokenWithBalance | null;
  onTokenChange(token: TokenWithBalance): void;
  maxAmount?: bigint;
  inputAmount?: bigint;
  onInputAmountChange?(data: { amount: string; bigint: bigint }): void;
  onSelectToggle?(): void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error?: string;
  padding?: string;
  label?: string;
  selectorLabel?: string;
  tokensList?: TokenWithBalance[];
  isValueLoading?: boolean;
  hideErrorMessage?: boolean;
  skipHandleMaxAmount?: boolean;
  containerRef?: MutableRefObject<HTMLElement | null>;
  withMaxButton?: boolean;
  withOnlyTokenPreselect?: boolean;
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
  padding,
  label,
  selectorLabel,
  isValueLoading,
  hideErrorMessage,
  skipHandleMaxAmount,
  setIsOpen,
  containerRef,
  withMaxButton = true,
  withOnlyTokenPreselect = true,
}: TokenSelectProps) {
  const { t } = useTranslation();
  const { currencyFormatter, currency } = useSettingsContext();

  const selectButtonRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [amountInCurrency, setAmountInCurrency] = useState<string>();

  const decimals =
    selectedToken && 'decimals' in selectedToken ? selectedToken.decimals : 18;

  // Stringify maxAmount for referential equality in useEffect
  const maxAmountString = maxAmount
    ? new TokenUnit(maxAmount, decimals, '').toDisplay()
    : null;
  const [isMaxAmount, setIsMaxAmount] = useState(false);

  const handleAmountChange = useCallback(
    ({ amount, bigint }: { amount: string; bigint: bigint }) => {
      onInputAmountChange?.({ amount, bigint });
      if (!maxAmountString) {
        return;
      }
      setIsMaxAmount(maxAmountString === amount);
    },
    [onInputAmountChange, maxAmountString],
  );
  const hideTokenDropdown = tokensList && tokensList.length < 2;

  const displayTokenList = useDisplaytokenlist({
    tokensList,
    searchQuery,
  });

  const formattedAmount = useMemo(() => {
    const price = selectedToken?.priceInCurrency;
    const amount =
      inputAmount && inputAmount !== 0n && price
        ? currencyFormatter(
            parseFloat(
              bigToLocaleString(bigintToBig(inputAmount, decimals)).replace(
                /,/g,
                '',
              ),
            ) * price,
          )
        : undefined;
    return amount;
  }, [currencyFormatter, decimals, inputAmount, selectedToken]);

  useEffect(() => {
    setAmountInCurrency(formattedAmount);
  }, [formattedAmount]);

  // When setting to the max, pin the input value to the max value
  useEffect(() => {
    if (!isMaxAmount || !maxAmountString || skipHandleMaxAmount) return;
    handleAmountChange({
      amount: maxAmountString,
      bigint: stringToBigint(maxAmountString, decimals),
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
    const hasOnlyOneToken = tokensList?.length === 1;
    const theOnlyToken = hasOnlyOneToken ? tokensList[0] : undefined;
    const isOnlyTokenNotSelected =
      theOnlyToken && theOnlyToken?.symbol !== selectedToken?.symbol;

    if (withOnlyTokenPreselect && isOnlyTokenNotSelected) {
      onTokenChange(theOnlyToken);
      return;
    }
    // when selected token is not supported, clear it
    const supportedSymbols = tokensList?.flatMap((tok) => tok.symbol) ?? [];

    if (
      selectedToken &&
      tokensList?.[0] &&
      !supportedSymbols.includes(selectedToken.symbol)
    ) {
      onTokenChange(tokensList[0]);
    }
  }, [withOnlyTokenPreselect, tokensList, onTokenChange, selectedToken]);

  const rowRenderer = useCallback(
    ({ key, index, style }) => {
      const token = displayTokenList[index];

      if (!token) {
        // Token should be truthy and should not get here. Just adding this to not break the list if this happens. This will make the row just empty.
        return <div style={style} key={key}></div>;
      }
      return (
        <StyledDropdownMenuItem
          style={style}
          data-testid={`token-search-menu-item-${index}`}
          key={key}
          onClick={() => {
            onTokenChange(token.token);
            onSelectToggle?.();
          }}
        >
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TokenIcon
                width="32px"
                height="32px"
                src={token.symbol === 'ETH' ? EthLogo : token.token.logoUri}
                name={token.symbol}
              />
              <Typography variant="h6" sx={{ ml: 2 }}>
                <TokenEllipsis text={token.name} maxLength={14} />
              </Typography>
            </Stack>
            <BalanceColumn>
              <Typography variant="body1">
                {token.displayValue}{' '}
                <TokenEllipsis text={token.symbol} maxLength={8} />
              </Typography>
            </BalanceColumn>
          </Stack>
        </StyledDropdownMenuItem>
      );
    },
    [displayTokenList, onSelectToggle, onTokenChange],
  );

  const renderTokenLabel = useCallback(() => {
    if (
      !selectedToken ||
      (!hasUnconfirmedBTCBalance(selectedToken) &&
        !isAvaxWithUnavailableBalance(selectedToken))
    ) {
      return `${t('Balance')}: ${selectedToken?.balanceDisplayValue ?? '0'}`;
    }

    if (hasUnconfirmedBTCBalance(selectedToken)) {
      return (
        <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!selectedToken?.unconfirmedBalance && (
            <Tooltip
              placement="top"
              title={`${t('Unavailable')}: ${
                selectedToken?.unconfirmedBalanceDisplayValue
              } ${selectedToken?.symbol}`}
            >
              <InfoCircleIcon sx={{ mr: 0.5, cursor: 'pointer' }} />
            </Tooltip>
          )}
          {t('Available Balance')}: {selectedToken?.balanceDisplayValue ?? '0'}
        </Stack>
      );
    }

    if (isAvaxWithUnavailableBalance(selectedToken)) {
      return (
        <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
          {!!selectedToken?.balance && (
            <Tooltip
              placement="top"
              title={`${t('Total Balance')}: ${
                selectedToken?.balanceDisplayValue
              } ${selectedToken?.symbol}`}
            >
              <InfoCircleIcon sx={{ mr: 0.5, cursor: 'pointer' }} />
            </Tooltip>
          )}
          {t('Spendable Balance')}:{' '}
          {selectedToken?.availableDisplayValue ?? '0'}
        </Stack>
      );
    }
  }, [selectedToken, t]);

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack
        sx={{
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding,
          m: () => (!padding ? '0 0 8px' : '0'),
        }}
      >
        <Typography variant="body2" fontWeight="fontWeightSemibold">
          {label ?? t('Token')}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {renderTokenLabel()}
        </Typography>
      </Stack>
      <SelectContainer>
        <InputContainer
          data-testid="token-selector-dropdown"
          ref={selectButtonRef}
          sx={{
            flexDirection: 'row',
            padding,
            borderRadius: isOpen ? '8px 8px 0 0' : '8px',
          }}
        >
          <TokenSelector
            onClick={onSelectToggle}
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
            label={selectorLabel ?? t('Select Token')}
          />
          <BNInput
            value={
              isMaxAmount && !skipHandleMaxAmount
                ? maxAmount || inputAmount
                : inputAmount
            }
            denomination={decimals}
            onChange={handleAmountChange}
            isValueLoading={isValueLoading}
            data-testid="token-amount-input"
            max={
              !isValueLoading ? maxAmount || selectedToken?.balance : undefined
            }
            withMaxButton={withMaxButton}
          />
        </InputContainer>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding,
            m: () => (!padding ? '4px 0 0 0' : '0'),
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: (theme) => theme.palette.error.main }}
          >
            {hideErrorMessage ? '' : error}
          </Typography>
          <Stack sx={{ minHeight: '14px' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {amountInCurrency
                ? `${amountInCurrency.replace(currency, '')} ${currency}`
                : `${currencyFormatter(0).replace(currency, '')} ${currency}`}
            </Typography>
          </Stack>
        </Stack>

        {!hideTokenDropdown && (
          <ContainedDropdown
            anchorEl={selectButtonRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            containerRef={containerRef}
          >
            <DropdownContents>
              <Divider sx={{ mx: 2, mt: 1 }} />
              <SearchInputContainer>
                <SearchBar
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.currentTarget.value)
                  }
                  placeholder={t('Search')}
                  sx={{
                    my: 2,
                  }}
                  data-testid="search-input"
                />
              </SearchInputContainer>
              <Stack sx={{ flexDirection: 'column', flexGrow: 1 }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <VirtualizedList
                      height={height}
                      rowCount={displayTokenList.length}
                      rowHeight={48}
                      rowRenderer={rowRenderer}
                      width={width}
                    />
                  )}
                </AutoSizer>
              </Stack>
            </DropdownContents>
          </ContainedDropdown>
        )}
      </SelectContainer>
    </Stack>
  );
}
