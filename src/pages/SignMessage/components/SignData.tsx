import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-components';
import { positionValues } from 'react-custom-scrollbars-2';

import { MessageParams } from '@src/background/services/messages/models';
import { ForwardedRef, forwardRef } from 'react';
import { ScrollableMessageCard } from './ScrollableMessageCard';

/**
 * This is in support of of EIP-712
 * @link https://eips.ethereum.org/EIPS/eip-712
 *
 * Here is metamasks docs on this @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v1
 * ref(ForwardedRef) is used to track if the whole content has been viewed by the parent component
 *
 * @param param0
 * @returns
 */
export const SignData = forwardRef(function SignData(
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

  const data = message.data;

  return (
    <Stack sx={{ width: 1, gap: 1 }}>
      <Typography variant="caption">{t('Message:')}</Typography>
      <ScrollableMessageCard ref={ref} scrollUpdateHandler={updateHandler}>
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
        <div ref={ref} style={{ height: '1px' }} />
      </ScrollableMessageCard>
    </Stack>
  );
});
