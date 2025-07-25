import {
  Avatar,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { currencies } from '@core/types';
import { useSettingsContext } from '@core/ui/src/contexts/SettingsProvider';
import { useTranslation } from 'react-i18next';
import { runtime } from 'webextension-polyfill';

export const CurrencySelector = () => {
  const { updateCurrencySetting, currency } = useSettingsContext();
  const { t } = useTranslation();

  return (
    // this needs to be replaced with SelectCountry when it is ready in k2-alpine
    <Select
      label={t('Currency')}
      value={currency}
      renderValue={(selected) => {
        const selectedCurrency = currencies.find((c) => c.symbol === selected);
        if (!selectedCurrency) {
          return;
        }
        const countryCode = selectedCurrency.countryCode;

        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            gap={1}
          >
            <Avatar
              sx={{
                width: '16px',
                height: '16px',
              }}
              src={runtime.getURL(
                `images/currencies/${countryCode.toLowerCase()}.svg`,
              )}
              alt={`${countryCode} flag`}
              slotProps={{
                img: {
                  loading: 'lazy',
                  sx: {
                    objectFit: 'cover',
                  },
                },
              }}
            />
            <Typography>{selectedCurrency.symbol}</Typography>
          </Stack>
        );
      }}
      onChange={(e) => {
        const newValue = e.target.value;
        const found = currencies.find((c) => c.symbol === newValue);
        if (found) {
          updateCurrencySetting(found.symbol);
        }
      }}
    >
      {currencies.map((c) => (
        <MenuItem key={c.symbol} value={c.symbol}>
          {`${c.label} (${c.symbol})`}
        </MenuItem>
      ))}
    </Select>
  );
};
