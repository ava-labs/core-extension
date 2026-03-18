import {
  ButtonProps,
  CountryFlag,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import {
  useAnalyticsContext,
  useFeatureFlagContext,
  useSettingsContext,
} from '@core/ui';
import { FeatureGates } from '@core/types';
import { useTranslation } from 'react-i18next';
import { SelectButton } from '@/components/SelectButton';
import { getCurrencies } from '../constants';

export const CurrencySelector = (props: ButtonProps) => {
  const { updateCurrencySetting, currency } = useSettingsContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();

  const isBalanceServiceIntegrationOn = isFlagEnabled(
    FeatureGates.BALANCE_SERVICE_INTEGRATION,
  );

  const currencies = getCurrencies(isBalanceServiceIntegrationOn);

  const selectedCurrency = currencies.find((c) => c.symbol === currency);

  return (
    <SelectButton
      renderValue={
        !selectedCurrency ? (
          <Typography variant="subtitle2" color="text.secondary">
            {t('Select Currency')}
          </Typography>
        ) : (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={1}
            p={0}
          >
            <CountryFlag countryCode={selectedCurrency.countryCode} size={16} />
            <Typography variant="subtitle2" color="text.secondary">
              {selectedCurrency.symbol}
            </Typography>
          </Stack>
        )
      }
      options={currencies.map((c) => ({
        key: c.symbol.toString(),
        label: c.label.toString(),
        value: c.symbol.toString(),
        dataTestId: `currency-selector-menu-item-${c.symbol}`,
        selected: c.symbol === currency,
        selectValue: c.symbol.toString(),
      }))}
      onOptionSelect={async (selectValue) => {
        updateCurrencySetting(selectValue);
        capture('CurrencySettingChanged', { currency: selectValue });
      }}
      {...props}
    />
  );
};
