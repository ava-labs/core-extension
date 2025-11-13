import { ActionButtons } from '@/components/ActionButtons';
import { Box, Stack, Typography } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';

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
    <Stack flexGrow={1}>
      <Typography variant="h2" pr={2} mt={3.5}>
        {label}
      </Typography>
      <Stack
        mt={1.5}
        gap={1}
        direction="row"
        pr={2}
        color="error.main"
        alignItems="center"
      >
        <Box flexShrink={0}>
          <MdErrorOutline size={24} />
        </Box>
        <Typography variant="subtitle3">{message}</Typography>
      </Stack>
      <ActionButtons
        top={{
          label: t('Delete'),
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
    </Stack>
  );
};
