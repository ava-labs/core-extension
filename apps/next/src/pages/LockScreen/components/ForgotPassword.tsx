import {
  Button,
  DialogContent,
  Stack,
  SxProps,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { ResetExtensionStateHandler } from '~/services/storage/handlers/resetExtensionState';

import { PageTopBar } from '@/components/PageTopBar';
import { WarningMessage } from '@/components/WarningMessage';
import { Page } from '@/components/Page';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const smallButtonFixSx: SxProps = {
  height: '32px',
};

export const ForgotPassword: FC<Props> = ({ onCancel, onConfirm }) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const theme = useTheme();

  const onConfirmClick = async () => {
    await request<ResetExtensionStateHandler>({
      method: ExtensionRequest.RESET_EXTENSION_STATE,
      params: [true],
    });
    onConfirm();
  };

  return (
    <Page onBack={onCancel} title={t(`You're about to terminate this session`)}>
      <Stack
        width="100%"
        direction="column"
        rowGap={3}
        paddingBlock="28px 22px"
        paddingInline="0px 30px"
      >
        <WarningMessage>
          {t(
            'Make sure you have written down your recovery phrase or stored your login credentials. Failure to do this may result in lost funds.',
          )}
        </WarningMessage>
      </Stack>
      <Stack width="100%" rowGap="10px" mt="auto" px={1}>
        <Button
          sx={smallButtonFixSx}
          variant="contained"
          size="extension"
          onClick={onConfirmClick}
        >
          {t('Confirm')}
        </Button>
        <Button
          sx={smallButtonFixSx}
          variant="contained"
          size="extension"
          color="secondary"
          onClick={onCancel}
        >
          {t('Cancel')}
        </Button>
      </Stack>
    </Page>
  );
};
