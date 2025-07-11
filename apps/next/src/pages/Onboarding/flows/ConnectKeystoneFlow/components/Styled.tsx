import { FC } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonProps,
  OutboundIcon,
  Typography,
  Stack,
} from '@avalabs/k2-alpine';

import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { ErrorType } from '../types';

export const KeystoneSupportButton: FC<ButtonProps> = ({
  children,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Button
      size="medium"
      variant="text"
      endIcon={<OutboundIcon size={24} />}
      component="a"
      href="https://guide.keyst.one/docs/connecting-software-wallets-to-keystone"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children ?? t('Keystone support')}
    </Button>
  );
};

type KeystoneConnectionErrorProps = {
  errorType: ErrorType;
  onRetry: () => void;
};

export const KeystoneConnectionError = ({
  errorType,
  onRetry,
}: KeystoneConnectionErrorProps) => {
  const { t } = useTranslation();

  return (
    <Stack
      width="100%"
      gap={3}
      textAlign="center"
      flexGrow={1}
      justifyContent="center"
      maxWidth="340px"
    >
      <Stack gap={1.5} alignItems="center" color="error.main">
        <FiAlertCircle size={32} color="currentColor" />
        {errorType === 'unable-to-connect' && <UnableToConnectMessage />}
        {errorType === 'user-rejected' && <UserRejectedMessage />}
      </Stack>
      <Stack direction="row" justifyContent="center">
        <NavButton size="medium" color="primary" onClick={onRetry}>
          {t('Retry')}
        </NavButton>
      </Stack>
    </Stack>
  );
};

const UnableToConnectMessage = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={0.5} color="error.main">
      <Typography variant="body2">{t('Unable to connect')}</Typography>
      <Typography variant="body2">
        {t(
          'Make sure your device is connected and you have granted Keystone browser permissions.',
        )}
      </Typography>
    </Stack>
  );
};

const UserRejectedMessage = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={0.5} color="error.main">
      <Typography variant="body2">
        {t('Keystone request was cancelled.')}
      </Typography>
      <Typography variant="body2">{t('To proceed, please retry.')}</Typography>
    </Stack>
  );
};
