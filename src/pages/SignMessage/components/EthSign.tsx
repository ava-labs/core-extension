import {
  Card,
  Scrollbars,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { positionValues } from 'react-custom-scrollbars-2';
import { MessageParams } from '@src/background/services/messages/models';
import { forwardRef, ForwardedRef } from 'react';

// ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component

export const EthSign = forwardRef(function EthSign(
  {
    message,
    updateHandler,
  }: {
    message: MessageParams;
    updateHandler: (values: positionValues) => void;
  },
  ref: ForwardedRef<HTMLDivElement | null>,
) {
  const { t } = useTranslation();

  return (
    <Stack sx={{ width: 1 }}>
      <Typography
        variant="body2"
        color="warning.main"
        sx={{ textAlign: 'center', mx: 1, mb: 2 }}
      >
        {t(
          "Signing this message can be dangerous. This signature could potentially perform any operation on your account's behalf, including granting complete control of your account and all of its assets to the requesting site. Only sign this message if you know what you're doing or completely trust the requesting site",
        )}
      </Typography>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        {t('Message:')}
      </Typography>
      <Card sx={{ py: 2, height: 105 }}>
        <Scrollbars
          style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
          onUpdate={updateHandler}
        >
          <Stack sx={{ px: 2 }}>
            <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
              {message.data}
            </Typography>
          </Stack>
          <div ref={ref} style={{ height: '1px' }} />
        </Scrollbars>
      </Card>
    </Stack>
  );
});
