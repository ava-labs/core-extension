import { useState } from 'react';
import {
  CheckmarkIcon,
  SearchInput,
  SecondaryDropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CURRENCIES } from '@src/background/services/settings/models';
import { TFunction, useTranslation } from 'react-i18next';

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
  const theme = useTheme();
  const { updateCurrencySetting, currency } = useSettingsContext();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const currencyNames = getCurrencyNames(t);

  const filteredCurrencies = Object.keys(CURRENCIES)
    .map((symbol) => ({ symbol, name: currencyNames[symbol] }))
    .filter(
      (c) =>
        !searchTerm ||
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={t('Currency')}
      />
      <VerticalFlex padding="16px 16px 24px">
        <SearchInput
          data-testid="currency-search-input"
          placeholder={t('Search')}
          onSearch={setSearchTerm}
          autoFocus={true}
        />
      </VerticalFlex>
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        {filteredCurrencies.map((c) => (
          <SecondaryDropDownMenuItem
            data-testid={`currency-menu-item-${c.symbol}`.toLowerCase()}
            selected={currency === c.symbol}
            padding="10px 16px"
            key={c.symbol}
            justify="space-between"
            align="center"
            onClick={() => {
              updateCurrencySetting(c.symbol);
            }}
          >
            <Typography size={14} height="17px">
              {currencyNames[c.symbol]} ({c.symbol})
            </Typography>
            {currency === c.symbol && (
              <CheckmarkIcon height="16px" color={theme.colors.icon1} />
            )}
          </SecondaryDropDownMenuItem>
        ))}
      </Scrollbars>
    </VerticalFlex>
  );
}
