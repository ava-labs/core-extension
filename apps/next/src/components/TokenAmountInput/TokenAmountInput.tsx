import { TokenUnit } from '@avalabs/core-utils-sdk';
import { CircularProgress, Collapse, Grow, Stack } from '@avalabs/k2-alpine';
import { FocusEventHandler, useCallback, useMemo } from 'react';
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
  maxAmount?: bigint;
  estimatedFee?: bigint;
  tokenId: string;
  tokensForAccount: FungibleTokenBalance[];
  onTokenChange: (token: string) => void;
  tokenQuery: string;
  onQueryChange: (tokenQuery: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  withPresetButtons?: boolean;
  tokenHint?: string;
  autoFocus?: boolean;
  isLoading?: boolean;
  onFocus?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  disabled?: boolean;
  tokenBalance?: boolean;
};

export const TokenAmountInput = ({
  id,
  maxAmount,
  estimatedFee,
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
  tokenBalance = true,
}: TokenAmountInputProps) => {
  const { t } = useTranslation();
  const convertedCurrencyFormatter = useConvertedCurrencyFormatter();

  const token = useMemo(
    () => tokensForAccount.find((tok) => getUniqueTokenId(tok) === tokenId),
    [tokensForAccount, tokenId],
  );

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
      const amountToSubtract =
        percentage === 100 && isNativeToken(token) ? (estimatedFee ?? 0n) : 0n;

      const calculatedMaxAmount = tokenUnit
        .div(100 / percentage)
        .sub(new TokenUnit(amountToSubtract, token.decimals, token.symbol));

      // Make sure we never seem silly by telling the user to send a negative amount.
      onAmountChange(
        calculatedMaxAmount.lt(0n) ? '0' : calculatedMaxAmount.toString(),
      );
    },
    [onAmountChange, estimatedFee, token],
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
          onValueChange={onTokenChange}
          query={tokenQuery}
          onQueryChange={onQueryChange}
          hint={tokenHint}
          disabled={disabled}
          tokenBalance={tokenBalance}
        />
        <Grow in={Boolean(token)} mountOnEnter unmountOnExit>
          <InvisibleAmountInput
            autoFocus={autoFocus}
            placeholder={(0).toFixed(2)}
            onChange={(ev) => onAmountChange(ev.target.value)}
            error={Boolean(isAmountTooBig) || amountBigInt < 0n}
            helperText={
              isLoading ? <CircularProgress size={12} /> : currencyValue || '-'
            }
            slotProps={{
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
