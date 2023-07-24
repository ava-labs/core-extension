import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { MessageParams } from '@src/background/services/messages/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { toUtf8 } from 'ethereumjs-util';
import { positionValues } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';

export function PersonalSign({
  message,
  scrollFrameHandler,
  updateHandler,
}: {
  message: MessageParams;
  scrollFrameHandler: (values: positionValues) => void;
  updateHandler: (values: positionValues) => void;
}) {
  const { t } = useTranslation();
  return (
    <VerticalFlex width={'100%'}>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        {t('Message:')}
      </Typography>
      <Card height="250px" padding="16px 0">
        <Scrollbars
          style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
          onScrollFrame={scrollFrameHandler}
          onUpdate={updateHandler}
        >
          <VerticalFlex padding="0 16px">
            <Typography size={12} height="17px" wordBreak="break-all">
              {toUtf8(message.data)}
            </Typography>
          </VerticalFlex>
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
