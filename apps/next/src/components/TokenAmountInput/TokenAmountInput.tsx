import { TokenUnit } from '@avalabs/core-utils-sdk';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { Collapse, Grow, Stack } from '@avalabs/k2-alpine';

import { stringToBigint } from '@core/common';
import { useConvertedCurrencyFormatter } from '@core/ui';
import { getUniqueTokenId, FungibleTokenBalance } from '@core/types';

import { TokenSelect } from '@/components/TokenSelect';

import { AmountPresetButton, InvisibleAmountInput } from './components';

type TokenAmountInputProps = {
  id: string;
  tokenId: string;
  tokensForAccount: FungibleTokenBalance[];
  onTokenChange: (token: string) => void;
  tokenQuery: string;
  onQueryChange: (tokenQuery: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
};

export const TokenAmountInput = ({
  id,
  tokenId,
  tokensForAccount,
  onTokenChange,
  tokenQuery,
  onQueryChange,
  amount,
  onAmountChange,
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

  // TODO: Figure out how to expose the error state to the parent component,
  // so it can render the message wherever it wants to.
  // TODO: Take transaction fees into account when calculating if the amount is too big.
  const isAmountTooBig = token ? amountBigInt > token.balance : false;

  const handlePresetClick = useCallback(
    (percentage: number) => {
      if (!token) return;

      const tokenUnit = new TokenUnit(
        token.balance,
        token.decimals,
        token.symbol,
      );

      // TODO: Take transaction fees into account when calculating the max amount.
      onAmountChange(tokenUnit.div(100 / percentage).toString());
    },
    [onAmountChange, token],
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
        gap={1}
        width="100%"
      >
        <TokenSelect
          id={`${id}-token-select`}
          tokenId={tokenId}
          tokenList={tokensForAccount}
          onValueChange={onTokenChange}
          query={tokenQuery}
          onQueryChange={onQueryChange}
        />
        <Grow in={Boolean(token)} mountOnEnter unmountOnExit>
          <InvisibleAmountInput
            autoFocus
            placeholder={(0).toFixed(2)}
            onChange={(ev) => onAmountChange(ev.target.value)}
            error={Boolean(isAmountTooBig)}
            helperText={currencyValue || '-'} // Prevents the helper text from disappearing completely
            value={amount}
          />
        </Grow>
      </Stack>
      <Collapse in={Boolean(token)} mountOnEnter unmountOnExit>
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
