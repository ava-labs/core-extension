import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { Action } from '@src/background/services/actions/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { toUtf8 } from 'ethereumjs-util';
import { useTranslation } from 'react-i18next';

export function PersonalSign({ message }: { message: Action }) {
  const { t } = useTranslation();
  return (
    <VerticalFlex width={'100%'}>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        {t(' Message:')}
      </Typography>
      <Card height="250px" padding="16px 0">
        <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
          <VerticalFlex padding="0 16px">
            <Typography size={12} height="17px" wordBreak="break-all">
              {toUtf8(message.displayData.data)}
            </Typography>
          </VerticalFlex>
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
