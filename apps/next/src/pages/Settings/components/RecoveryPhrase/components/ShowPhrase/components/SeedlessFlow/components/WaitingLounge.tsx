import { ArcProgress } from '@/components/ArcProgress';
import { Page } from '@/components/Page';
import { Box, Button, Stack, StackProps, Typography } from '@avalabs/k2-alpine';
import { useSeedlessMnemonicExport } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useFlowNavigation } from '../useFlowNavigation';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const WaitingLounge = () => {
  const { t } = useTranslation();
  const { leave } = useFlowNavigation();
  const { timeLeft, cancelExport } = useSeedlessMnemonicExport();
  return (
    <Page title={t('Show recovery phrase')} contentProps={contentProps}>
      <Stack
        position="relative"
        my="auto"
        alignItems="center"
        justifyContent="center"
      >
        <ArcProgress size={190} value={25} color="success" />
        <Box position="absolute" bottom={2} textAlign="center" width={1}>
          <Typography variant="caption" color="text.primary">
            {t("Your wallet's recovery phrase will be visible in")}
          </Typography>
          <Typography
            variant="h2"
            fontWeight="bold"
            color="text.primary"
            textAlign="center"
          >
            {timeLeft}
          </Typography>
        </Box>
      </Stack>
      <Button
        variant="contained"
        size="extension"
        fullWidth
        color="secondary"
        onClick={() => {
          cancelExport();
          leave();
        }}
      >
        {t('Cancel request')}
      </Button>
    </Page>
  );
};
