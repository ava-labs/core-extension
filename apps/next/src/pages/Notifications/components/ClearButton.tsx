import { FC } from 'react';
import { Button, alpha, useTheme } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

type ClearButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export const ClearButton: FC<ClearButtonProps> = ({ onClick, disabled }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: alpha(theme.palette.text.secondary, 0.25),
        borderRadius: '360px',
        minWidth: 'auto',
        px: 1.5,
        py: 0.5,
        '&:hover': {
          backgroundColor: alpha(theme.palette.text.secondary, 0.35),
        },
      }}
    >
      {t('Clear')}
    </Button>
  );
};
