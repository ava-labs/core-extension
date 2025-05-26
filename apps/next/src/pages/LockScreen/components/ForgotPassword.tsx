import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Stack, SxProps, Typography } from '@avalabs/k2-alpine';

import { useConnectionContext } from '@core/ui';
import { ExtensionRequest } from '@core/types';
import { ResetExtensionStateHandler } from '~/services/storage/handlers/resetExtensionState';

import { WarningMessage } from '@/components/WarningMessage';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const smallButtonFixSx: SxProps = {
  height: '32px',
};

export const ForgotPassword: FC<Props> = ({ open, onCancel, onConfirm }) => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();

  const onConfirmClick = async () => {
    await request<ResetExtensionStateHandler>({
      method: ExtensionRequest.RESET_EXTENSION_STATE,
      params: [true],
    });
    onConfirm();
  };

  return (
    <Modal open={open} disablePortal closeAfterTransition>
      <Stack
        direction="column"
        rowGap={3}
        height={1}
        paddingBlock="85px 22px"
        paddingInline="14px 30px"
      >
        <Typography variant="h2">
          {t(`You're about to terminate this session`)}
        </Typography>
        <WarningMessage>
          {t(
            'Make sure you have written down your recovery phrase. Without it you will not be able to access the current wallet and could result in lost funds',
          )}
        </WarningMessage>
        <Stack direction="column" rowGap="10px" mt="auto">
          <Button
            sx={smallButtonFixSx}
            variant="contained"
            size="small"
            onClick={onConfirmClick}
          >
            {t('Confirm')}
          </Button>
          <Button
            sx={smallButtonFixSx}
            variant="contained"
            size="small"
            color="secondary"
            onClick={onCancel}
          >
            {t('Cancel')}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
