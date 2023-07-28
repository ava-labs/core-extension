import { useTranslation } from 'react-i18next';
import { Card, Scrollbars, Stack, Typography } from '@avalabs/k2-components';
import { positionValues } from 'react-custom-scrollbars-2';

import { MessageParams } from '@src/background/services/messages/models';

/**
 * This is in support of of EIP-712
 * @link https://eips.ethereum.org/EIPS/eip-712
 *
 * Here is metamasks docs on this @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v1
 *
 * @param param0
 * @returns
 */
export function SignData({
  message,
  scrollFrameHandler,
  updateHandler,
}: {
  message: MessageParams;
  scrollFrameHandler: (values: positionValues) => void;
  updateHandler: (values: positionValues) => void;
}) {
  const { t } = useTranslation();
  const data = message.data;

  return (
    <Stack sx={{ width: 1, gap: 1 }}>
      <Typography variant="caption">{t('Message:')}</Typography>
      <Card sx={{ height: 250, py: 2 }}>
        <Scrollbars
          onScrollFrame={scrollFrameHandler}
          onUpdate={updateHandler}
          style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
        >
          {data?.map((x, i) => (
            <Stack key={i} sx={{ px: 2, pb: 3, gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {x.name}:
              </Typography>
              <Typography
                variant="caption"
                color="text.primary"
                sx={{ fontWeight: 'fontWeightBold', wordBreak: 'break-all' }}
              >
                {x.value}
              </Typography>
            </Stack>
          ))}
        </Scrollbars>
      </Card>
    </Stack>
  );
}
