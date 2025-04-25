import {
  Slide,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { useNetworkContext } from '@/contexts/NetworkProvider';
import { useTranslation } from 'react-i18next';

export const TestnetBanner = () => {
  const { isDeveloperMode } = useNetworkContext();
	const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Slide direction="down" in={isDeveloperMode} mountOnEnter unmountOnExit>
      <Stack sx={{ pt: 1 }} data-testid="testnet-banner">
        <Stack
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            width: 1,
            px: 2,
            height: '24px',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              color: 'warning.contrastText',
              fontWeight: theme.typography.fontWeightSemibold,
            }}
          >
            {t('Testnet')}
          </Typography>
        </Stack>
      </Stack>
    </Slide>
  );
};
