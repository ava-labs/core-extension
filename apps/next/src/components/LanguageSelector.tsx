import {
  Button,
  ChevronDownIcon,
  Popover,
  PopoverContent,
  PopoverItem,
  useTheme,
} from '@avalabs/k2-alpine';
import { useState } from 'react';
import { useAnalyticsContext, useLanguage } from '@core/ui';

export function LanguageSelector() {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const { availableLanguages, changeLanguage, currentLanguage } = useLanguage();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="text"
        size="small"
        color="primary"
        onClick={handleClick}
        data-testid="onboarding-language-selector"
        endIcon={
          <ChevronDownIcon
            size={16}
            sx={{
              color: 'text.secondary',
              transition: theme.transitions.create('transform'),
              transform: open ? 'rotateX(180deg)' : 'none',
            }}
          />
        }
      >
        {currentLanguage?.name}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <PopoverContent>
          {availableLanguages.map((lang) => (
            <PopoverItem
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                capture('OnboardingLanguageChanged', {
                  language: lang.code,
                });
              }}
              data-testid={`onboarding-language-selector-menu-item-${lang.code}`}
              selected={lang.code === currentLanguage?.code}
            >
              {lang.name} ({lang.originalName})
            </PopoverItem>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
