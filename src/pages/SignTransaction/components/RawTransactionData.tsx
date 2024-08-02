import { useTranslation } from 'react-i18next';
import { Scrollbars, Stack, Typography } from '@avalabs/core-k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { getHexStringToBytes } from '@src/utils/getHexStringToBytes';

export const RawTransactionData = ({ onClose, data }) => {
  const { t } = useTranslation();

  return (
    <Stack sx={{ width: '100%', gap: 3, flexGrow: 1 }}>
      <PageTitle onBackClick={() => onClose()} margin="0">
        {t('Transaction Data')}
      </PageTitle>
      <Stack sx={{ gap: 1, px: 2, pb: 2, flexGrow: 1 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>
            {t('Hex Data')}
          </Typography>
          <Typography variant="body2">
            {t('{{length}} Bytes', { length: getHexStringToBytes(data) })}
          </Typography>
        </Stack>
        <Stack
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            wordBreak: 'break-all',
            typography: 'body2',
            userSelect: 'all',
            flexGrow: 1,
          }}
        >
          <Scrollbars>{data}</Scrollbars>
        </Stack>
      </Stack>
    </Stack>
  );
};
