import { Avatar, ButtonProps, Stack, Typography } from '@avalabs/k2-alpine';
import { useAnalyticsContext } from '@core/ui/src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@core/ui/src/contexts/SettingsProvider';
import { useTranslation } from 'react-i18next';
import { runtime } from 'webextension-polyfill';
import { SelectButton } from '../../../components/SelectButton';
import { currencies } from '../constants';

export const CurrencySelector = (props: ButtonProps) => {
  const { updateCurrencySetting, currency } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const { t } = useTranslation();

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
            {/* TODO: use CountryFlag component from k2 once it is available */}
            <Avatar
              sx={{
                width: '16px',
                height: '16px',
              }}
              src={runtime.getURL(
                `images/currencies/${selectedCurrency.countryCode.toLowerCase()}.svg`,
              )}
              alt={`${selectedCurrency.countryCode} flag`}
              slotProps={{
                img: {
                  loading: 'lazy',
                  sx: {
                    objectFit: 'cover',
                  },
                },
              }}
            />
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
