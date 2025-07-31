import {
  Avatar,
  Button,
  ButtonProps,
  ClickAwayListener,
  Popper,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { currencies } from '@core/types';
import { useAnalyticsContext } from '@core/ui/src/contexts/AnalyticsProvider';
import { useSettingsContext } from '@core/ui/src/contexts/SettingsProvider';
import { runtime } from 'webextension-polyfill';
import { SelectMenuItem } from '../../../components/SelectMenuItem';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { useState } from 'react';

export const CurrencySelector = (props: ButtonProps) => {
  const { updateCurrencySetting, currency } = useSettingsContext();
  const { capture } = useAnalyticsContext();
  const theme = useTheme();

  const selectedCurrency = currencies.find((c) => c.symbol === currency);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <Button
          variant="text"
          size="small"
          color="primary"
          onClick={handleClick}
          data-testid="settings-currency-selector"
          endIcon={
            <MdOutlineUnfoldMore
              size={16}
              color={theme.palette.text.secondary}
            />
          }
          {...props}
          sx={{
            ...props.sx,
            '& .MuiButton-endIcon': {
              marginLeft: 0,
            },
          }}
        >
          {!selectedCurrency ? null : (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              gap={1}
              p={0}
            >
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
          )}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{ padding: '10px 0' }}
        >
          {currencies.map((c) => (
            <SelectMenuItem
              key={c.symbol}
              value={c.symbol}
              label={`${c.label} (${c.symbol})`}
              selected={c.symbol === currency}
              onClick={() => {
                updateCurrencySetting(c.symbol);
                capture('CurrencySettingChanged', { currency: c.symbol });
                handleClose();
              }}
            />
          ))}
        </Popper>
      </div>
    </ClickAwayListener>
  );
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
