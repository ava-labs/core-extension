import {
  Button,
  ButtonProps,
  ClickAwayListener,
  Popper,
  useTheme,
} from '@avalabs/k2-alpine';
import { ColorScheme } from '@core/types';
import { useAnalyticsContext, useSettingsContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { SelectMenuItem } from '../../../components/SelectMenuItem';

const colorSchemeOptions: ColorScheme[] = ['LIGHT', 'DARK', 'SYSTEM'];

export const ThemeSelector = (props: ButtonProps) => {
  const { theme: selectedColorScheme, updateTheme } = useSettingsContext();
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();
  const theme = useTheme();

  const getThemeLabel = (scheme: ColorScheme) => {
    switch (scheme) {
      case 'LIGHT':
        return t('Light');
      case 'DARK':
        return t('Dark');
      case 'SYSTEM':
        return t('System');
    }
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const clickHandler = async (scheme: ColorScheme) => {
    await updateTheme(scheme);
    capture(`ThemeSettingChanged`, {
      theme: scheme,
    });
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <Button
          variant="text"
          size="small"
          color="primary"
          onClick={handleClick}
          data-testid="settings-theme-selector"
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
          {getThemeLabel(selectedColorScheme)}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{ padding: '10px 0' }}
        >
          {colorSchemeOptions.map((schemeOption) => (
            <SelectMenuItem
              key={schemeOption}
              label={getThemeLabel(schemeOption)}
              value={schemeOption}
              onClick={() => {
                clickHandler(schemeOption);
              }}
              data-testid={`theme-selector-menu-item-${schemeOption}`}
              selected={schemeOption === selectedColorScheme}
            />
          ))}
        </Popper>
      </div>
    </ClickAwayListener>
  );
};
