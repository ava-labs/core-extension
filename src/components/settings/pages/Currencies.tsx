import { ChangeEvent, useState } from 'react';
import {
  Stack,
  Scrollbars,
  Typography,
  ListItem,
  List,
  CheckIcon,
  SearchBar,
} from '@avalabs/core-k2-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CURRENCIES } from 'packages/service-worker/src/services/settings/models';
import { TFunction, useTranslation } from 'react-i18next';
import { StyledListButton } from '../components/StyledListItemButton';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

// TODO: bring back the commented currencies when the glacier supports them
export const getCurrencyNames = (t: TFunction<'translation'>) => {
  const currencyNames = {
    [CURRENCIES.USD]: t('United States Dollar'),
    [CURRENCIES.EUR]: t('Euro'),
    [CURRENCIES.GBP]: t('Pound Sterling'),
    [CURRENCIES.AUD]: t('Australian Dollar'),
    [CURRENCIES.CAD]: t('Canadian Dollar'),
    [CURRENCIES.CHF]: t('Swiss Franc'),
    [CURRENCIES.HKD]: t('Hong Kong Dollar'),
    // { name: 'Japanese Yen', symbol: 'JPY' },
    // { name: 'Chinese Renminbi', symbol: 'CNH' },
    // { name: 'New Zealand Dollar', symbol: 'NZD' },
  };
  return currencyNames;
};

export function Currencies({ goBack, navigateTo, width }: SettingsPageProps) {
  const { t } = useTranslation();
  const { updateCurrencySetting, currency } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const currencyNames = getCurrencyNames(t);

  const filteredCurrencies = Object.keys(CURRENCIES)
    .map((symbol) => ({ symbol, name: currencyNames[symbol] }))
    .filter(
      (c) =>
        !searchTerm ||
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <Stack
      sx={{
        width: `${width}`,
        height: '100%',
      }}
    >
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Currency')}
      />
      <Stack
        sx={{
          pt: 1,
          px: 2,
          pb: 3,
        }}
      >
        <SearchBar
          data-testid="currency-search-input"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          autoFocus={true}
        />
      </Stack>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <List sx={{ py: 0 }}>
          {filteredCurrencies.map((c) => (
            <ListItem key={c.symbol} sx={{ p: 0 }}>
              <StyledListButton
                data-testid={`currency-menu-item-${c.symbol}`.toLowerCase()}
                selected={currency === c.symbol}
                onClick={() => {
                  updateCurrencySetting(c.symbol);
                  capture('CurrencySettingChanged', { currency: c.symbol });
                }}
              >
                <Typography variant="body2">
                  {currencyNames[c.symbol]} ({c.symbol})
                </Typography>
                {currency === c.symbol && <CheckIcon size={16} />}
              </StyledListButton>
            </ListItem>
          ))}
        </List>
      </Scrollbars>
    </Stack>
  );
}
