import { Button, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CORE_WEB_BASE_URL } from '@/config/constants';

export const AssetsEmptyState: FC = () => {
  const { t } = useTranslation();

  const handleLetsGoClick = () => {
    window.open(CORE_WEB_BASE_URL, '_blank');
  };

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      gap={1}
      px={5}
      textAlign="center"
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>🚀</span>
      <Typography variant="subtitle3">{t('No assets yet')}</Typography>
      <Typography variant="caption" color="text.secondary">
        {t('On-ramp using Core in two minutes')}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={handleLetsGoClick}
        sx={{
          mt: 2,
        }}
      >
        {t("Let's go")}
      </Button>
    </Stack>
  );
};
