import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { Action } from '@src/background/services/actions/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTheme } from 'styled-components';
import { t } from 'i18next';

export function BridgeTransferAsset({ action }: { action: Action }) {
  const theme = useTheme();
  const { displayData } = action;
  return (
    <VerticalFlex width={'100%'}>
      <Typography
        color={theme.colors.primary1}
        size={14}
        height="17px"
        margin="0 8px 16px"
        align="center"
      >
        {t('Core wants to bridge')}
      </Typography>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        {t('Message:')}
      </Typography>
      <Card height="105px" padding="16px 0">
        <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
          <VerticalFlex padding="0 16px">
            <Typography size={12} height="17px" wordBreak="break-all">
              {t(
                'You are about to bridge {{amountStr}} {{symbol}} on {{currentBlockchain}} Network',
                {
                  amountStr: displayData.amountStr,
                  symbol: displayData.asset.symbol,
                  currentBlockchain: displayData.currentBlockchain,
                }
              )}
            </Typography>
          </VerticalFlex>
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
