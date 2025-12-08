import { TokenUnit } from '@avalabs/core-utils-sdk';
import { CircularProgress, Collapse, Grow, Stack } from '@avalabs/k2-alpine';
import {
  FC,
  FocusEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';

import { stringToBigint } from '@core/common';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  isNativeToken,
} from '@core/types';
import { useConvertedCurrencyFormatter } from '@core/ui';

import { TokenSelect } from '@/components/TokenSelect';
import { getAvailableBalance } from '@/lib/getAvailableBalance';

import { AmountPresetButton, InvisibleAmountInput } from './components';

type TokenAmountInputProps = {
  id: string;
  estimatedFee?: bigint;
  alwaysApplyFee?: boolean;
  tokenId: string;
  tokensForAccount: FungibleTokenBalance[];
  onTokenChange: (token: string) => void;
  tokenQuery: string;
  onQueryChange: (tokenQuery: string) => void;
  amount: string;
  maxAmount?: bigint;
  minAmount?: bigint;
  onAmountChange: (amount: string) => void;
  withPresetButtons?: boolean;
  tokenHint?: string;
  autoFocus?: boolean;
  isLoading?: boolean;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  disabled?: boolean;
};

export const TokenAmountInput: FC<TokenAmountInputProps> = ({
  id,
  maxAmount,
  minAmount = 0n,
  estimatedFee,
  alwaysApplyFee,
  tokenId,
  tokensForAccount,
  onTokenChange,
  tokenQuery,
  onQueryChange,
  amount,
  onAmountChange,
  withPresetButtons = true,
  tokenHint,
  autoFocus = true,
  isLoading = false,
  onFocus,
  onBlur,
  disabled,
}) => {
  const { t } = useTranslation();
  const convertedCurrencyFormatter = useConvertedCurrencyFormatter();
  const amountInputRef = useRef<HTMLInputElement>(null);

  const token = useMemo(
    () => tokensForAccount.find((tok) => getUniqueTokenId(tok) === tokenId),
    [tokensForAccount, tokenId],
  );

  // Auto-focus the input when a token is selected
  useEffect(() => {
    if (token && amountInputRef.current) {
      // Use a small delay to ensure the Grow animation has started
      const timeoutId = setTimeout(() => {
        amountInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  // Amount comes in as a string, we need to convert it to BigInt for computation
  const amountHasValue =
    Number.isFinite(parseFloat(amount)) && parseFloat(amount) !== 0;
  const amountBigInt =
    token && amountHasValue ? stringToBigint(amount, token.decimals) : 0n;

  const isAmountTooBig = token && maxAmount ? amountBigInt > maxAmount : false;

  const handlePresetClick = useCallback(
    (percentage: number) => {
      if (!token) return;

      const tokenUnit = new TokenUnit(
        getAvailableBalance(token, false),
        token.decimals,
        token.symbol,
      );

      // If sending the max. amount of a native token, we need to subtract the estimated fee.
      const shouldSubtractFee =
        alwaysApplyFee || (percentage === 100 && isNativeToken(token));
      const amountToSubtract = shouldSubtractFee ? (estimatedFee ?? 0n) : 0n;
      const calculatedMaxAmount = tokenUnit
        .div(100 / percentage)
        .sub(new TokenUnit(amountToSubtract, token.decimals, token.symbol));

      // Make sure we never seem silly by telling the user to send a negative amount.
      onAmountChange(
        calculatedMaxAmount.lt(0n) ? '0' : calculatedMaxAmount.toString(),
      );
    },
    [token, alwaysApplyFee, estimatedFee, onAmountChange],
  );

  const usdValue =
    token && token.priceInCurrency && amountHasValue
      ? new TokenUnit(amountBigInt, token.decimals, token.symbol).toDisplay({
          asNumber: true,
        }) * token.priceInCurrency
      : undefined;

  const currencyValue =
    typeof usdValue === 'number'
      ? convertedCurrencyFormatter(usdValue)
      : undefined;

  return (
    <Stack py={1} px={1.5} gap={1}>
      <Stack
        id={id}
        display="grid"
        gridTemplateColumns={token ? 'auto minmax(50%, 1fr)' : '1fr'}
        gap={2}
        width="100%"
      >
        <TokenSelect
          id={`${id}-token-select`}
          tokenId={tokenId}
          tokenList={tokensForAccount}
          onValueChange={(selectedTokenId) => {
            onTokenChange(selectedTokenId);
            amountInputRef.current?.focus();
          }}
          query={tokenQuery}
          onQueryChange={onQueryChange}
          hint={tokenHint}
          disabled={disabled}
        />
        <Grow in={Boolean(token)} mountOnEnter unmountOnExit>
          <InvisibleAmountInput
            autoFocus={autoFocus}
            placeholder={(0).toFixed(2)}
            onChange={(ev) => onAmountChange(ev.target.value)}
            error={Boolean(isAmountTooBig) || amountBigInt < minAmount}
            helperText={
              isLoading ? <CircularProgress size={12} /> : currencyValue || '-'
            }
            slotProps={{
              htmlInput: {
                ref: amountInputRef,
              },
              input: {
                readOnly: isLoading,
                onFocus,
                onBlur,
                disabled,
              },
            }}
            value={amount}
          />
        </Grow>
      </Stack>
      <Collapse
        in={withPresetButtons && Boolean(token)}
        mountOnEnter
        unmountOnExit
      >
        <Stack
          direction="row"
          width="100%"
          justifyContent="end"
          alignItems="center"
          gap={1}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <AmountPresetButton onClick={() => handlePresetClick(25)}>
            {t('25%')}
          </AmountPresetButton>
          <AmountPresetButton onClick={() => handlePresetClick(50)}>
            {t('50%')}
          </AmountPresetButton>
          <AmountPresetButton onClick={() => handlePresetClick(100)}>
            {t('Max')}
          </AmountPresetButton>
        </Stack>
      </Collapse>
    </Stack>
  );
};
