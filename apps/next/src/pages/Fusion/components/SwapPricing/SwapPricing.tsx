import {
  ChevronRightIcon,
  IconButton,
  Stack,
  useTheme,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as Styled from '../Styled';
import { ExchangeRate } from './ExchangeRate';
import { SwapQuoteSelect } from './SwapQuoteSelect';

export const SwapPricing = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isQuoteSelectOpen, setIsQuoteSelectOpen] = useState(false);

  return (
    <Styled.SettingRow title={t('Pricing')}>
      <Stack direction="row" alignItems="center" gap={0.5} mr={-1}>
        <ExchangeRate />
        <IconButton
          size="small"
          sx={{ p: 0 }}
          onClick={() => setIsQuoteSelectOpen(true)}
        >
          <ChevronRightIcon size={24} color={theme.palette.text.secondary} />
        </IconButton>
      </Stack>
      <SwapQuoteSelect
        open={isQuoteSelectOpen}
        onClose={() => setIsQuoteSelectOpen(false)}
      />
    </Styled.SettingRow>
  );
};
