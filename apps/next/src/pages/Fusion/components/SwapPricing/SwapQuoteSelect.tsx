import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Skeleton, Stack } from '@avalabs/k2-alpine';

import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { SlideUpDialog } from '@/components/Dialog';

import { useFusionState } from '../../contexts/FusionStateContext';
import * as Styled from '../Styled';
import { ExchangeRate } from './ExchangeRate';
import { SwapAggregatorSelect } from './SwapAggregatorSelect';

type SwapQuoteSelectProps = {
  open: boolean;
  onClose: () => void;
};

export const SwapQuoteSelect: FC<SwapQuoteSelectProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();

  const { quote, quotes } = useFusionState();

  return (
    <SlideUpDialog open={open} onClose={onClose}>
      <Page
        title={t('Pricing details')}
        onBack={onClose}
        contentProps={{
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'normal',
        }}
      >
        <Card>
          <Stack width="100%" px={2}>
            <Styled.SettingRow title={t('Rate')}>
              <ExchangeRate color="text.secondary" />
            </Styled.SettingRow>
            <Divider />
            {quote && quotes.length > 0 ? (
              <SwapAggregatorSelect quotes={quotes} quote={quote} />
            ) : (
              <Styled.SettingRow title={t('Provider')}>
                <Skeleton variant="text" width={100} />
              </Styled.SettingRow>
            )}
          </Stack>
        </Card>
      </Page>
    </SlideUpDialog>
  );
};
