import { Page } from '@/components/Page';
import {
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useFlowNavigation } from '../useFlowNavigation';

const StyledCircularProgress = styled(CircularProgress)({
  position: 'absolute',
  top: '100%',
  rotate: '-90deg',

  [`& .${circularProgressClasses.circle}`]: {
    strokeLinecap: 'round',
  },
});

export const RequestExport = () => {
  const { t } = useTranslation();
  const { leave } = useFlowNavigation();

  return (
    <Page
      title={t('Show recovery\nphrase')}
      contentProps={{
        justifyContent: undefined,
      }}
    >
      <Box
        position="relative"
        width={200}
        height={100}
        my="auto"
        overflow="hidden"
      >
        <StyledCircularProgress
          variant="determinate"
          value={100}
          size="100%"
          thickness={2}
          color="secondary"
        />

        <StyledCircularProgress
          variant="determinate"
          value={25}
          size="100%"
          thickness={2}
          color="success"
        />
        <Stack
          gap={0.5}
          mx={3}
          position="absolute"
          bottom={0}
          textAlign="center"
        >
          <Typography variant="caption" color="text.secondary">
            {t("Your wallet's recovery phrase will be visible in")}
          </Typography>
          <Typography variant="h2" fontWeight="bold" color="text.primary">
            18hr 08mn
          </Typography>
        </Stack>
      </Box>

      <Button
        variant="contained"
        size="extension"
        fullWidth
        color="secondary"
        onClick={leave}
        sx={{ mt: 'auto' }}
      >
        {t('Cancel request')}
      </Button>
    </Page>
  );
};
