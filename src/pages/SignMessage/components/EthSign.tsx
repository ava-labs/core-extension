import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { MessageParams } from '@src/background/services/messages/models';
import { positionValues } from 'react-custom-scrollbars-2';

export function EthSign({
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
  return (
    <VerticalFlex width={'100%'}>
      <Typography
        color={theme.colors.primary1}
        size={14}
        height="17px"
        margin="0 8px 16px"
        align="center"
      >
        {t(
          "Signing this message can be dangerous. This signature could potentially perform any operation on your account's behalf, including granting complete control of your account and all of its assets to the requesting site. Only sign this message if you know what you're doing or completely trust the requesting site"
        )}
      </Typography>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        {t('Message:')}
      </Typography>
      <Card height="105px" padding="16px 0">
        <Scrollbars
          style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
          onScrollFrame={scrollFrameHandler}
          onUpdate={updateHandler}
        >
          <VerticalFlex padding="0 16px">
            <Typography size={12} height="17px" wordBreak="break-all">
              {message.data}
            </Typography>
          </VerticalFlex>
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
