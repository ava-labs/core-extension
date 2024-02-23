import {
  Popper,
  Button,
  ChevronDownIcon,
  Typography,
  Grow,
  CheckIcon,
  MenuItem,
  MenuList,
  useTheme,
} from '@avalabs/k2-components';
import { wordPhraseLength } from '@src/utils/seedPhraseValidation';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function WordsLengthSelector({
  wordsLength: currentWordsLength,
  setWordsLength,
}: {
  wordsLength: number;
  setWordsLength: (length: number) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const buttonRef = useRef<HTMLButtonElement>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Button
      color="secondary"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      ref={buttonRef}
      data-testid="onboarding-language-selector"
      sx={{ width: '135px' }}
      size="small"
    >
      {`${currentWordsLength} ${t('Word Phrase')}`}

      <ChevronDownIcon
        size={16}
        sx={{
          transition: theme.transitions.create('transform'),
          transform: isDropdownOpen ? 'rotateX(180deg)' : 'none',
          ml: 1,
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
              {wordPhraseLength.map((length) => {
                return (
                  <MenuItem
                    key={length}
                    onClick={() => {
                      setWordsLength(length);
                    }}
                    data-testid={`onboarding-words-length-selector-menu-item-${length}`}
                    sx={{
                      flexDirection: 'row',
                      gap: 2,
                      justifyContent: 'space-between',
                      px: 1,
                    }}
                  >
                    <Typography
                      color={
                        currentWordsLength !== length
                          ? 'text.secondary'
                          : 'text.primary'
                      }
                    >
                      {`${length} ${t('Word Phrase')}`}
                    </Typography>
                    {currentWordsLength === length && <CheckIcon size={18} />}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Grow>
        )}
      </Popper>
    </Button>
  );
}
