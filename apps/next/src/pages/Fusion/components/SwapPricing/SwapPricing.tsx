import {
  ChevronRightIcon,
  Collapse,
  IconButton,
  Stack,
  useTheme,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SwapProviders } from '@core/ui';

import { useSwapState } from '../../contexts';
import * as Styled from '../Styled';
import { ExchangeRate } from './ExchangeRate';
import { SwapQuoteSelect } from './SwapQuoteSelect';

export const SwapPricing = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const { provider } = useSwapState();

  const [isQuoteSelectOpen, setIsQuoteSelectOpen] = useState(false);

  const isProviderChoiceAvailable = provider === SwapProviders.MARKR;

  return (
    <Styled.SettingRow title={t('Pricing')}>
      <Stack direction="row" alignItems="center" gap={0.5} mr={-1}>
        <ExchangeRate />
        <Collapse orientation="horizontal" in={isProviderChoiceAvailable}>
          <IconButton
            size="small"
            disabled={!isProviderChoiceAvailable}
            sx={{ p: 0 }}
            onClick={() => setIsQuoteSelectOpen(true)}
          >
            <ChevronRightIcon size={24} color={theme.palette.text.secondary} />
          </IconButton>
        </Collapse>
      </Stack>
      <SwapQuoteSelect
        open={isQuoteSelectOpen}
        onClose={() => setIsQuoteSelectOpen(false)}
      />
    </Styled.SettingRow>
  );
};
