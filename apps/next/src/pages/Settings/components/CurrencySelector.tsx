import { Avatar, ButtonProps, Stack, Typography } from '@avalabs/k2-alpine';
import { currencies } from '@core/types';
import { useAnalyticsContext } from '@core/ui/src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@core/ui/src/contexts/SettingsProvider';
import { useTranslation } from 'react-i18next';
import { runtime } from 'webextension-polyfill';
import { SelectButton } from '../../../components/SelectButton';

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
  // return (
  //   <ClickAwayListener onClickAway={handleClose}>
  //     <div>
  //       <Button
  //         variant="text"
  //         size="small"
  //         color="primary"
  //         onClick={handleClick}
  //         data-testid="settings-currency-selector"
  //         endIcon={
  //           <MdOutlineUnfoldMore
  //             size={16}
  //             color={theme.palette.text.secondary}
  //           />
  //         }
  //         {...props}
  //         sx={{
  //           ...props.sx,
  //           '& .MuiButton-endIcon': {
  //             marginLeft: 0,
  //           },
  //         }}
  //       >
  //         {!selectedCurrency ? null : (
  //           <Stack
  //             direction="row"
  //             alignItems="center"
  //             justifyContent="flex-end"
  //             gap={1}
  //             p={0}
  //           >
  //             <Avatar
  //               sx={{
  //                 width: '16px',
  //                 height: '16px',
  //               }}
  //               src={runtime.getURL(
  //                 `images/currencies/${selectedCurrency.countryCode.toLowerCase()}.svg`,
  //               )}
  //               alt={`${selectedCurrency.countryCode} flag`}
  //               slotProps={{
  //                 img: {
  //                   loading: 'lazy',
  //                   sx: {
  //                     objectFit: 'cover',
  //                   },
  //                 },
  //               }}
  //             />
  //             <Typography variant="subtitle2" color="text.secondary">
  //               {selectedCurrency.symbol}
  //             </Typography>
  //           </Stack>
  //         )}
  //       </Button>
  //       <Popper
  //         open={open}
  //         anchorEl={anchorEl}
  //         placement="bottom-end"
  //         sx={{ padding: '10px 0' }}
  //       >
  //         {currencies.map((c) => (
  //           <SelectMenuItem
  //             key={c.symbol}
  //             value={c.symbol}
  //             label={`${c.label} (${c.symbol})`}
  //             selected={c.symbol === currency}
  //             onClick={() => {
  //               updateCurrencySetting(c.symbol);
  //               capture('CurrencySettingChanged', { currency: c.symbol });
  //               handleClose();
  //             }}
  //           />
  //         ))}
  //       </Popper>
  //     </div>
  //   </ClickAwayListener>
  // );
  //   <Select
  //     label={t('Currency')}
  //     value={currency}
  //     renderValue={(selected) => {
  //       const selectedCurrency = currencies.find((c) => c.symbol === selected);
  //       if (!selectedCurrency) {
  //         return;
  //       }
  //       const countryCode = selectedCurrency.countryCode;

  //       return (
  //         <Stack
  //           direction="row"
  //           alignItems="center"
  //           justifyContent="flex-end"
  //           gap={1}
  //         >
  //           <Avatar
  //             sx={{
  //               width: '16px',
  //               height: '16px',
  //             }}
  //             src={runtime.getURL(
  //               `images/currencies/${countryCode.toLowerCase()}.svg`,
  //             )}
  //             alt={`${countryCode} flag`}
  //             slotProps={{
  //               img: {
  //                 loading: 'lazy',
  //                 sx: {
  //                   objectFit: 'cover',
  //                 },
  //               },
  //             }}
  //           />
  //           <Typography variant="subtitle2" color="text.secondary">
  //             {selectedCurrency.symbol}
  //           </Typography>
  //         </Stack>
  //       );
  //     }}
  //     onChange={(e) => {
  //       const newValue = e.target.value;
  //       const found = currencies.find((c) => c.symbol === newValue);
  //       if (found) {
  //         const symbol = found.symbol;
  //         updateCurrencySetting(symbol);
  //         capture('CurrencySettingChanged', { currency: symbol });
  //       }
  //     }}
  //   >
  //     {currencies.map((c) => (
  //       <SelectMenuItem
  //         key={c.symbol}
  //         value={c.symbol}
  //         label={`${c.label} (${c.symbol})`}
  //         selected={c.symbol === currency}
  //       />
  //     ))}
  //   </Select>
  // );
};
