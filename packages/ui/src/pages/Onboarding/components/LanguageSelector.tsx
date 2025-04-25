import { useRef, useState } from 'react';
import {
  Button,
  CheckIcon,
  ChevronDownIcon,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';

import { useAnalyticsContext } from '@/contexts/AnalyticsProvider';
import { useLanguage } from '@/hooks/useLanguages';

export function LanguageSelector() {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const { availableLanguages, changeLanguage, currentLanguage } = useLanguage();

  const buttonRef = useRef<HTMLButtonElement| null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsDropdownOpen(false)}>
      <Button
        variant="text"
        color="primary"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        ref={buttonRef}
        data-testid="onboarding-language-selector"
        sx={{ gap: 0.5, color: 'text.primary' }}
      >
        <Typography variant="body2" className="current-language">
          {currentLanguage?.name}
        </Typography>

        <ChevronDownIcon
          size={16}
          sx={{
            transition: theme.transitions.create('transform'),
            transform: isDropdownOpen ? 'rotateX(180deg)' : 'none',
          }}
        />
        <Popper
          open={isDropdownOpen}
          anchorEl={buttonRef.current}
          placement="bottom-end"
          transition
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={250}>
              <MenuList
                dense
                sx={{
                  p: 0,
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {availableLanguages.map((lang) => {
                  const isCurrentLang = lang.code === currentLanguage?.code;

                  return (
                    <MenuItem
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        capture('OnboardingLanguageChanged', {
                          language: lang.code,
                        });
                      }}
                      data-testid={`onboarding-language-selector-menu-item-${lang.code}`}
                      sx={{
                        flexDirection: 'row',
                        gap: 2,
                        justifyContent: 'space-between',
                        px: 1,
                      }}
                    >
                      <Typography
                        color={
                          isCurrentLang ? 'text.secondary' : 'text.primary'
                        }
                      >
                        {lang.name} ({lang.originalName})
                      </Typography>
                      {isCurrentLang && <CheckIcon size={18} />}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Grow>
          )}
        </Popper>
      </Button>
    </ClickAwayListener>
  );
}
