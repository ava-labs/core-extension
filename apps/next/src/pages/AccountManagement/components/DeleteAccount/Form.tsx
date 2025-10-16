import { ActionButtons } from '@/components/ActionButtons';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';
import { ViewHost } from '../ViewHost';

type Props = {
  label: string;
  message: string;
  onDelete: () => void;
  onCancel: () => void;
};

export const DeleteAccountForm: FC<Props> = ({
  label,
  message,
  onDelete,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <ViewHost in>
      <Typography variant="h2" pr={2}>
        {label}
      </Typography>
      <Stack gap={1} direction="row" pr={2} color="error.main">
        <Box flexShrink={0}>
          <MdErrorOutline size={24} />
        </Box>
        <Typography variant="subtitle3">{message}</Typography>
      </Stack>
      <ActionButtons
        top={{
          label: t('Yes, delete'),
          onClick: onDelete,
          color: 'secondary',
          panic: true,
        }}
        bottom={{
          label: t('Cancel'),
          onClick: onCancel,
          color: 'secondary',
        }}
      />
    </ViewHost>
  );
};
