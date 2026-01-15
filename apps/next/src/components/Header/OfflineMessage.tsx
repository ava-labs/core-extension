import {
  Box,
  Stack,
  Typography,
  useTheme,
  getHexAlpha,
  Slide,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { RiWifiOffLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';

export const OfflineMessage: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Slide direction="down" in mountOnEnter unmountOnExit>
      <Stack
        direction="row"
        alignItems="center"
        gap={1.5}
        width="100%"
        px={1.5}
        py={1}
        bgcolor={getHexAlpha(theme.palette.error.main, 10)}
        color="error.main"
      >
        <Box flexShrink={0} lineHeight={1}>
          <RiWifiOffLine size={24} />
        </Box>
        <Typography variant="body3" fontWeight={500}>
          {t('No Internet connection')}
        </Typography>
      </Stack>
    </Slide>
  );
};
