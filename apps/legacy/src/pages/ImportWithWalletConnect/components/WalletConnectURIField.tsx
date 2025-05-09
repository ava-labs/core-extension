import {
  CopyIcon,
  IconButton,
  Scrollbars,
  Stack,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountImportStatus } from '@core/ui';

import { getColorForStatus } from './utils/getColorForStatus';

type Props = {
  uri: string;
  status: AccountImportStatus;
};

export const WalletConnectURIField = ({ uri, status }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const onCopyClick = useCallback(() => {
    navigator.clipboard.writeText(uri);
    toast.success(t('Copied!'), { duration: 2000 });
  }, [uri, t]);

  return (
    <Stack
      sx={{
        width: 224,
        height: 212,
        background: theme.palette.grey[850],
        wordWrap: 'break-word',
        px: 2,
        pt: 1.5,
        pb: 1,
        borderRadius: 1,
        fontSize: 14,
        userSelect: 'all',
        border: '1px solid transparent',
        transition: theme.transitions.create('border-color'),
        borderColor: getColorForStatus(status),
      }}
    >
      <Scrollbars>{uri}</Scrollbars>
      <Stack sx={{ width: 1, mt: -1, alignItems: 'flex-end', flexShrink: 0 }}>
        <IconButton
          size="small"
          sx={{ opacity: 0.6, mr: -0.5 }}
          onClick={onCopyClick}
        >
          <CopyIcon size={14} />
        </IconButton>
      </Stack>
    </Stack>
  );
};
