import {
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { Message } from '@src/background/services/messages/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';

/**
 * @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v4
 * @param param0
 * @returns
 */
export function SignDataV4({ message }: { message: Message }) {
  const data = message.displayData.data;

  const renderRow = (data: any) => {
    return Object.keys(data).map((key) => {
      if (typeof data[key] === 'object') {
        return (
          <VerticalFlex key={key} padding="0 16px">
            <Typography size={14} height="17px" weight={600}>
              {key}:
            </Typography>
            {renderRow(data[key])}
          </VerticalFlex>
        );
      }

      return (
        <HorizontalFlex key={key} padding="0 16px">
          <Typography size={14} height="17px" weight={600} margin="0 8px 0 0">
            {key}:{' '}
          </Typography>
          <Typography size={12} height="17px" wordBreak="break-all">
            {data[key]}
          </Typography>
        </HorizontalFlex>
      );
    });
  };

  // remove type fields from data we don't want to render
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { types, primaryType, ...dataWithoutTypes } = data;
  return (
    <VerticalFlex width={'100%'}>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        Message:
      </Typography>
      <Card height="250px" padding="16px 0">
        <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
          {renderRow(dataWithoutTypes)}
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
