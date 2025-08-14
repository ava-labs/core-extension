import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogContent,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';

import { useConnectionContext } from '@core/ui';
import { ExtensionRequest } from '@core/types';
import { ResetExtensionStateHandler } from '~/services/storage/handlers/resetExtensionState';

import { WarningMessage } from '@/components/WarningMessage';
import { PageTopBar } from '@/components/PageTopBar';
import { SlideUpDialog } from '@/components/Dialog';

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
  const theme = useTheme();

  const onConfirmClick = async () => {
    await request<ResetExtensionStateHandler>({
      method: ExtensionRequest.RESET_EXTENSION_STATE,
      params: [true],
    });
    onConfirm();
  };

  return (
    <SlideUpDialog open={open}>
      <PageTopBar onBackClicked={onCancel} showBack />
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: theme.spacing(1.5),
        }}
      >
        <Stack
          direction="column"
          rowGap={3}
          paddingBlock="28px 22px"
          paddingInline="0px 30px"
        >
          <Typography variant="h2">
            {t(`You're about to terminate this session`)}
          </Typography>
          <WarningMessage>
            {t(
              'Make sure you have written down your recovery phrase. Without it you will not be able to access the current wallet and could result in lost funds',
            )}
          </WarningMessage>
        </Stack>
        <Stack rowGap="10px" mt="auto" px={1}>
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
      </DialogContent>
    </SlideUpDialog>
  );
};
