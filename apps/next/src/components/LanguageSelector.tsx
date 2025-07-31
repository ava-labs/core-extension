import {
  Button,
  ButtonProps,
  ClickAwayListener,
  Popper,
  useTheme,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useAnalyticsContext, useLanguage } from '@core/ui';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { SelectMenuItem } from './SelectMenuItem';

type LanguageSelectorProps = ButtonProps & {
  isOnboarding?: boolean;
};

export function LanguageSelector({
  isOnboarding = false,
  ...props
}: LanguageSelectorProps) {
  const { capture } = useAnalyticsContext();
  const { availableLanguages, changeLanguage, currentLanguage } = useLanguage();
  const theme = useTheme();

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
          data-testid={
            isOnboarding
              ? 'onboarding-language-selector'
              : 'settings-language-selector'
          }
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
          {currentLanguage?.name}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{ padding: '10px 0' }}
        >
          {availableLanguages.map((lang) => (
            <SelectMenuItem
              key={lang.code}
              label={`${lang.name} (${lang.originalName})`}
              value={lang.code}
              onClick={async () => {
                await changeLanguage(lang.code);
                const eventName = isOnboarding
                  ? 'OnboardingLanguageChanged'
                  : 'AppLanguageChanged';
                capture(eventName, {
                  language: lang.code,
                });
                handleClose();
              }}
              data-testid={`${
                isOnboarding
                  ? 'onboarding-language-selector-menu-item'
                  : 'settings-language-selector-menu-item'
              }-${lang.code}`}
              selected={lang.code === currentLanguage?.code}
            />
          ))}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
