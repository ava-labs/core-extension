import { Card, Typography, VerticalFlex } from '@avalabs/react-components';
import { Action } from '@src/background/services/actions/models';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useTheme } from 'styled-components';

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
        Core wants to bridge
      </Typography>
      <Typography size={12} height="15px" margin="0 0 8px 0">
        Message:
      </Typography>
      <Card height="105px" padding="16px 0">
        <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
          <VerticalFlex padding="0 16px">
            <Typography size={12} height="17px" wordBreak="break-all">
              You are about to bridge {displayData.amountStr}{' '}
              {displayData.asset.symbol} on {displayData.currentBlockchain}{' '}
              Network
            </Typography>
          </VerticalFlex>
        </Scrollbars>
      </Card>
    </VerticalFlex>
  );
}
