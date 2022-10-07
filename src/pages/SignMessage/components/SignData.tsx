import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { Action } from '@src/background/services/actions/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { t } from 'i18next';

/**
 * This is in support of of EIP-712
 * @link https://eips.ethereum.org/EIPS/eip-712
 *
 * Here is metamasks docs on this @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v1
 *
 * @param param0
 * @returns
 */
export function SignData({ message }: { message: Action }) {
  const data = message.displayData.data;
  return (
    <VerticalFlex width={'100%'}>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        {t('Message:')}
      </Typography>
      <Card height="250px" padding="16px 0">
        <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
          {data?.map((x, i) => (
            <VerticalFlex key={i} padding="0 16px 24px">
              <Typography size={14} height="17px">
                {x.name}:{' '}
              </Typography>
              <Typography size={12} height="17px" wordBreak="break-all">
                {x.value}
              </Typography>
            </VerticalFlex>
          ))}
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
