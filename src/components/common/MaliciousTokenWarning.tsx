import type { BoxProps } from '@avalabs/core-k2-components';
import {
  AlertTriangleIcon,
  Box,
  Tooltip,
  useTheme,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { WarningBox } from '@src/pages/Permissions/components/WarningBox';

export const MaliciousTokenWarningBox = (props: BoxProps) => {
  const { t } = useTranslation();

  return (
    <Box {...props}>
      <WarningBox
        title={t('Malicious Token')}
        text={t(
          'This token has been flagged as malicious. Use caution when interacting with it.',
        )}
      />
    </Box>
  );
};

export const MaliciousTokenWarningIcon = ({ size }: { size?: number }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tooltip title={t('This token has been flagged as malicious')}>
      <AlertTriangleIcon color={theme.palette.warning.main} size={size ?? 16} />
    </Tooltip>
  );
};
