import { ArcProgress } from '@/components/ArcProgress';
import { Page } from '@/components/Page';
import { Box, Button, Stack, styled, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useFlowNavigation } from '../useFlowNavigation';

const ProgressContainer = styled(Box)({
  position: 'relative',
  marginBlock: 'auto',
  overflow: 'hidden',
});

export const RequestExport = () => {
  const { t } = useTranslation();
  const { leave } = useFlowNavigation();

  return (
    <Page
      title={t('Show recovery phrase')}
      contentProps={{
        justifyContent: undefined,
      }}
    >
      <ProgressContainer>
        <ArcProgress size={200} value={25} color="success" />
        <Stack
          gap={0.5}
          mx={4}
          position="absolute"
          bottom={8}
          textAlign="center"
        >
          <Typography variant="caption" color="text.secondary">
            {t("Your wallet's recovery phrase will be visible in")}
          </Typography>
          <Typography variant="h2" fontWeight="bold" color="text.primary">
            18hr 08mn
          </Typography>
        </Stack>
      </ProgressContainer>

      <Button
        variant="contained"
        size="extension"
        fullWidth
        color="secondary"
        onClick={leave}
      >
        {t('Cancel request')}
      </Button>
    </Page>
  );
};
