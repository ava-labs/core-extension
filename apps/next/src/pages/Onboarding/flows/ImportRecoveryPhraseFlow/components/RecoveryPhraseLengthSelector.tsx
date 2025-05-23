import {
  Button,
  ChevronDownIcon,
  Popover,
  PopoverContent,
  PopoverItem,
} from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

type RecoveryPhraseLengthSelectorProps = {
  phraseLength: number;
  setPhraseLength: (length: number) => void;
};

export const RecoveryPhraseLengthSelector: FC<
  RecoveryPhraseLengthSelectorProps
> = ({ phraseLength, setPhraseLength }) => {
  const { t } = useTranslation();
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
        variant="contained"
        color="secondary"
        size="small"
        data-testid="onboarding-phrase-length-selector"
        endIcon={<ChevronDownIcon size={12} />}
        onClick={handleClick}
      >
        {t('{{length}}-word phrase', { length: phraseLength })}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <PopoverContent>
          <PopoverItem
            data-testid="onboarding-words-length-selector-menu-item-12"
            onClick={() => {
              setPhraseLength(12);
              handleClose();
            }}
            selected={phraseLength === 12}
          >
            {t('12-word phrase')}
          </PopoverItem>
          <PopoverItem
            data-testid="onboarding-words-length-selector-menu-item-24"
            onClick={() => {
              setPhraseLength(24);
              handleClose();
            }}
            selected={phraseLength === 24}
          >
            {t('24-word phrase')}
          </PopoverItem>
        </PopoverContent>
      </Popover>
    </>
  );
};
