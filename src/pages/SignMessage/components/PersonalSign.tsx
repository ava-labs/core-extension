import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { Message } from '@src/background/services/messages/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { toUtf8 } from 'ethereumjs-util';

export function PersonalSign({ message }: { message: Message }) {
  return (
    <VerticalFlex width={'100%'}>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        Message:
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
