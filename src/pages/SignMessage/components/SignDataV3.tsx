import {
  Card,
  HorizontalFlex,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { MessageParams } from '@src/background/services/messages/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { positionValues } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

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
  const theme = useTheme();

  const renderRow = (rowData: any) => {
    if (!rowData) {
      return null;
    }

    return Object.keys(rowData).map((key) => {
      if (typeof rowData[key] === 'object') {
        return (
          <VerticalFlex key={key} padding="0 16px">
            <Typography size={14} height="17px" color={theme.palette.grey[400]}>
              {key}:
            </Typography>
            {renderRow(rowData[key])}
          </VerticalFlex>
        );
      }

      return (
        <HorizontalFlex key={key} padding="0 16px">
          <Typography
            size={14}
            height="17px"
            margin="0 8px 0 0"
            color={theme.palette.grey[400]}
          >
            {key}:{' '}
          </Typography>
          <Typography
            size={12}
            height="17px"
            wordBreak="break-all"
            color={theme.palette.white[50]}
            weight={700}
          >
            {rowData[key]}
          </Typography>
        </HorizontalFlex>
      );
    });
  };

  // remove type fields from data we don't want to render
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { types, primaryType, ...dataWithoutTypes } = message.data;
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
          {renderRow(dataWithoutTypes)}
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
