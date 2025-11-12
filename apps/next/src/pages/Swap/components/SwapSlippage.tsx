import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';

import { InvisibileInput } from '@/components/Forms/InvisibleInput';

import { MIN_SLIPPAGE } from '../swap-config';
import { useSwapState } from '../contexts/SwapStateContext';
import { isSlippageValid } from '../lib/isSlippageValid';
import * as Styled from './Styled';
import { SwapProviders } from '@core/ui';

export const SwapSlippage = () => {
  const { t } = useTranslation();
  const { slippage, setSlippage, provider } = useSwapState();

  const [userSlippage, setUserSlippage] = useState(String(slippage));

  const isSlippageApplicable = provider !== SwapProviders.WNATIVE;

  return (
    <Styled.SettingRow
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      title={t('Slippage')}
      tooltip={t(
        'Suggested slippage - your transaction will fail if the fail price changes unfavorable more than this percentage',
      )}
    >
      <Stack direction="row" alignItems="center" gap={0.25}>
        <InvisibileInput
          min={MIN_SLIPPAGE}
          value={isSlippageApplicable ? userSlippage : '0'}
          readOnly={!isSlippageApplicable}
          max={100}
          step={0.1}
          type="number"
          onBlur={(ev) => {
            if (isSlippageValid(ev.target.value)) {
              setSlippage(parseFloat(ev.target.value));
            } else {
              setUserSlippage(String(MIN_SLIPPAGE));
              setSlippage(MIN_SLIPPAGE);
            }
          }}
          onChange={(e) => {
            const { value } = e.target;
            setUserSlippage(value);

            if (isSlippageValid(value)) {
              setSlippage(parseFloat(value));
            }
          }}
          inputMode="decimal"
          sx={{ textAlign: 'end', px: 0 }}
        />
        <Typography variant="body3" lineHeight="17px">
          %
        </Typography>
      </Stack>
    </Styled.SettingRow>
  );
};
