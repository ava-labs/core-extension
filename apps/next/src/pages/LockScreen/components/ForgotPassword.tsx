import { WarningMessage } from '@/components/WarningMessage';
import { Button, Modal, Stack, Typography } from '@avalabs/k2-alpine';
import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ResetExtensionStateHandler } from '~/services/storage/handlers/resetExtensionState';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
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
        rowGap="25px"
        height={1}
        paddingBlock="115px 22px"
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
          <Button variant="contained" onClick={onConfirmClick}>
            {t('Confirm')}
          </Button>
          <Button variant="contained" color="secondary" onClick={onCancel}>
            {t('Cancel')}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
