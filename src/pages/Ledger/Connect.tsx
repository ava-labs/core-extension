import {
  Card,
  ComponentSize,
  ConnectionIndicator,
  HorizontalFlex,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { StyledNumberList } from '@src/components/common/StyledNumberList';
import { LedgerAppType, useLedgerContext } from '@src/contexts/LedgerProvider';
import { useEffect } from 'react';
import { useTheme } from 'styled-components';

export function LedgerConnect() {
  const theme = useTheme();
  const { hasLedgerTransport, appType, popDeviceSelection } =
    useLedgerContext();

  useEffect(() => {
    popDeviceSelection();
    // Do this exactly once, all retries should be initiated by the user
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectedWithCorrectApp =
    hasLedgerTransport && appType === LedgerAppType.BITCOIN;

  return (
    <VerticalFlex height="100%" padding="0 16px">
      <Typography margin="12px" weight={700} height="29px" size={24}>
        Ledger Status
      </Typography>

      <Card padding="16px" margin="8px 0">
        <VerticalFlex grow="1">
          <HorizontalFlex width="100%" justify="space-between" align="center">
            <Typography size={14} height="17px">
              Status
            </Typography>
            <HorizontalFlex align="center">
              <ConnectionIndicator
                connected={hasLedgerTransport}
                disableTooltip
                size={8}
              />
              <Typography
                size={14}
                height="17px"
                color={theme.colors.text2}
                margin="0 0 0 8px"
              >
                {hasLedgerTransport ? 'Connected' : 'Disconnected'}
              </Typography>
            </HorizontalFlex>
          </HorizontalFlex>
          {hasLedgerTransport && (
            <HorizontalFlex
              width="100%"
              marginTop="16px"
              justify="space-between"
              align="center"
            >
              <Typography size={14} height="17px">
                Application
              </Typography>
              <Typography
                size={14}
                height="17px"
                color={theme.colors.text2}
                margin="0 0 0 8px"
              >
                {appType === LedgerAppType.BITCOIN ? 'Bitcoin' : 'Avalanche'}
              </Typography>
            </HorizontalFlex>
          )}
        </VerticalFlex>
      </Card>
      <Card margin="24px 0 0" padding="16px">
        <VerticalFlex>
          {connectedWithCorrectApp ? (
            <VerticalFlex width="100%">
              <Typography
                padding="10px 0"
                margin="0 0 16px"
                size={14}
                height="17px"
                weight={600}
              >
                To Continue:
              </Typography>
              <HorizontalFlex>
                <StyledNumberList>1.</StyledNumberList>
                <Typography size={14} height="17px" margin="0 0 24px 0">
                  Click close below.
                </Typography>
              </HorizontalFlex>

              <HorizontalFlex>
                <StyledNumberList>2.</StyledNumberList>
                <Typography size={14} height="17px" margin="0 0 24px 0">
                  Open Core in your browser.
                </Typography>
              </HorizontalFlex>

              <HorizontalFlex>
                <StyledNumberList>3.</StyledNumberList>
                <Typography size={14} height="17px">
                  Reenter the transaction details and try again.
                </Typography>
              </HorizontalFlex>
            </VerticalFlex>
          ) : (
            <VerticalFlex width="100%">
              <Typography
                padding="10px 0"
                margin="0 0 16px"
                size={14}
                height="17px"
                weight={600}
              >
                To Connect:
              </Typography>
              <HorizontalFlex>
                <StyledNumberList>1.</StyledNumberList>
                <Typography size={14} height="17px" margin="0 0 24px 0">
                  Connect the Ledger device to your computer.
                </Typography>
              </HorizontalFlex>

              <HorizontalFlex>
                <StyledNumberList>2.</StyledNumberList>
                <Typography size={14} height="17px" margin="0 0 24px 0">
                  Enter your PIN and access your device.
                </Typography>
              </HorizontalFlex>

              <HorizontalFlex>
                <StyledNumberList>3.</StyledNumberList>
                <Typography size={14} height="17px">
                  Ensure you have installed the latest{' '}
                  <Typography weight={600} size={14} height="inherit">
                    Bitcoin App
                  </Typography>{' '}
                  and open it on your device.
                </Typography>
              </HorizontalFlex>

              <Typography size={14} height="17px" margin="24px 0 0 ">
                If you do not have the Bitcoin App on your Ledger, please add it
                through the Ledger Live app manager.
              </Typography>
            </VerticalFlex>
          )}
        </VerticalFlex>
      </Card>
      <VerticalFlex grow="1" justify="flex-end">
        <PrimaryButton
          size={ComponentSize.LARGE}
          onClick={() => {
            if (connectedWithCorrectApp) {
              window.close();
            } else {
              popDeviceSelection();
            }
          }}
          width="100%"
        >
          {connectedWithCorrectApp ? 'Close' : 'Retry'}
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
