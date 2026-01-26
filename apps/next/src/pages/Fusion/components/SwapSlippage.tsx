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

import { useSwapState } from '../contexts/FusionStateContext';
import * as Styled from './Styled';
import { SwapProviders } from '@core/ui';
import { SwapSlippageDetails } from './SwapSlippage/SwapSlippageDetails';

export const SwapSlippage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { slippage, autoSlippage, provider } = useSwapState();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isSlippageApplicable = provider !== SwapProviders.WNATIVE;

  // Format display value
  const displayValue = isSlippageApplicable
    ? autoSlippage
      ? `Auto • ${slippage}%`
      : `${slippage}%`
    : '0%';

  return (
    <>
      <Styled.SettingRow
        title={t('Slippage')}
        tooltip={t(
          'Suggested slippage - your transaction will fail if the fail price changes unfavorable more than this percentage',
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
