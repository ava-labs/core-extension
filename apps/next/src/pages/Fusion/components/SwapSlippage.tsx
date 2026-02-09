import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronRightIcon,
  Stack,
  Typography,
  IconButton,
  Collapse,
  useTheme,
} from '@avalabs/k2-alpine';

import { useFusionState } from '../contexts';
import * as Styled from './Styled';
import { SwapSlippageDetails } from './SwapSlippage/SwapSlippageDetails';
import { isMarkrQuote } from '../lib/isMarkrQuote';

export const SwapSlippage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { slippage, autoSlippage, selectedQuote } = useFusionState();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isSlippageApplicable = isMarkrQuote(selectedQuote);

  // Format display value
  const displayValue = isSlippageApplicable
    ? autoSlippage
      ? t(`Auto`) // TODO: Indicate the exact value suggested by Markr if available.
      : `${slippage}%`
    : '0%';

  return (
    <>
      <Styled.SettingRow
        title={t('Slippage')}
        tooltip={t(
          'Suggested slippage — your transaction will fail if the price changes unfavorably by more than this percentage.',
        )}
      >
        <Stack direction="row" alignItems="center" gap={0.5} mr={-1}>
          <Typography variant="body3">{displayValue}</Typography>
          <Collapse orientation="horizontal" in={isSlippageApplicable}>
            <IconButton
              size="small"
              disabled={!isSlippageApplicable}
              sx={{ p: 0 }}
              onClick={() => setIsDetailsOpen(true)}
            >
              <ChevronRightIcon
                size={24}
                color={theme.palette.text.secondary}
              />
            </IconButton>
          </Collapse>
        </Stack>
      </Styled.SettingRow>

      <SwapSlippageDetails
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
};
