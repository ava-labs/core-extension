import { Box, Button, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onRefresh?: () => void;
};

export const SomethingWentWrong: FC<Props> = ({
  title,
  description,
  icon,
  onRefresh,
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      spacing={2}
      px={1}
      py={2}
      height={1}
      textAlign="center"
      justifyContent="center"
    >
      <Box
        sx={{
          fontSize: '22px',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateY(0)',
            },
            '40%': {
              transform: 'translateY(-10px)',
            },
            '60%': {
              transform: 'translateY(-5px)',
            },
          },
        }}
      >
        <Typography
          variant="h1"
          component="span"
          sx={{ mb: 2, fontWeight: 'medium' }}
        >
          {icon ?? '😩'}
        </Typography>
      </Box>

      <Stack textAlign="center">
        <Typography variant="subtitle3">{title}</Typography>

        <Typography variant="body3" color="text.secondary">
          {description}
        </Typography>

        {onRefresh && (
          <Box py={2}>
            <Button
              size="extension"
              variant="contained"
              color="secondary"
              onClick={onRefresh}
            >
              {t('Refresh')}
            </Button>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};
