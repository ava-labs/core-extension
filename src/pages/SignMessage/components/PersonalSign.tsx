import { toUtf8 } from 'ethereumjs-util';
import { positionValues } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Scrollbars,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

import { MessageParams } from '@src/background/services/messages/models';
import { forwardRef, ForwardedRef } from 'react';

// ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component

export const PersonalSign = forwardRef(function PersonalSign(
  {
    message,
    updateHandler,
  }: {
    message: MessageParams;
    updateHandler: (values: positionValues) => void;
  },
  ref: ForwardedRef<HTMLDivElement | null>
) {
  const { t } = useTranslation();

  return (
    <Stack sx={{ width: 1, gap: 1 }}>
      <Typography variant="caption">{t('Message:')}</Typography>
      <Card sx={{ height: 250, py: 2 }}>
        <Scrollbars
          style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
          onUpdate={updateHandler}
        >
          <Stack sx={{ px: 2 }}>
            <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
              {toUtf8(message.data)}
            </Typography>
          </Stack>
          <div ref={ref} style={{ height: '1px' }} />
        </Scrollbars>
      </Card>
    </Stack>
  );
});
