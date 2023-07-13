import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { Action } from '@src/background/services/actions/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { positionValues } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

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
  message: Action;
  scrollFrameHandler: (values: positionValues) => void;
  updateHandler: (values: positionValues) => void;
}) {
  const { t } = useTranslation();
  const data = message.displayData.data;
  const theme = useTheme();
  return (
    <VerticalFlex width={'100%'}>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        {t('Message:')}
      </Typography>
      <Card height="250px" padding="16px 0">
        <Scrollbars
          onScrollFrame={scrollFrameHandler}
          onUpdate={updateHandler}
          style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
        >
          {data?.map((x, i) => (
            <VerticalFlex key={i} padding="0 16px 24px" rowGap="4px">
              <Typography
                size={14}
                height="17px"
                color={theme.palette.grey[400]}
              >
                {x.name}:
              </Typography>
              <Typography
                size={12}
                height="17px"
                wordBreak="break-all"
                color={theme.palette.white[50]}
                weight={700}
              >
                {x.value}
              </Typography>
            </VerticalFlex>
          ))}
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
