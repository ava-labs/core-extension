import { useTranslation } from 'react-i18next';
import { Card, Stack, Typography } from '@avalabs/k2-components';
import { positionValues } from 'react-custom-scrollbars-2';

import { MessageParams } from '@src/background/services/messages/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';

/**
 * @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v3
 * @param param0
 * @returns
 */
export function SignDataV3({
  message,
  scrollFrameHandler,
  updateHandler,
}: {
  message: MessageParams;
  scrollFrameHandler: (values: positionValues) => void;
  updateHandler: (values: positionValues) => void;
}) {
  const { t } = useTranslation();

  const renderRow = (rowData: any) => {
    if (!rowData) {
      return null;
    }

    return Object.keys(rowData).map((key) => {
      if (typeof rowData[key] === 'object') {
        return (
          <Stack key={key} sx={{ px: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {key}:
            </Typography>
            {renderRow(rowData[key])}
          </Stack>
        );
      }

      return (
        <Stack
          key={key}
          direction="row"
          sx={{ px: 2, gap: 0.5, alignItems: 'flex-start' }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: '17px' }}
          >
            {key}:{' '}
          </Typography>
          <Typography
            variant="caption"
            color="text.primary"
            sx={{
              wordBreak: 'break-all',
              fontWeight: 'fontWeightBold',
              lineHeight: '17px',
            }}
          >
            {rowData[key]}
          </Typography>
        </Stack>
      );
    });
  };

  // remove type fields from data we don't want to render
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { types, primaryType, ...dataWithoutTypes } = message.data;
  return (
    <Stack sx={{ width: 1, gap: 1 }}>
      <Typography variant="caption">{t('Message:')}</Typography>
      <Card sx={{ height: 250, py: 2 }}>
        <Scrollbars
          style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
          onScrollFrame={scrollFrameHandler}
          onUpdate={updateHandler}
        >
          {renderRow(dataWithoutTypes)}
        </Scrollbars>
      </Card>
    </Stack>
  );
}
