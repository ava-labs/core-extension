import {
  ConnectionIndicator,
  HorizontalFlex,
  HorizontalSeparator,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import {
  SUPPORTED_LEDGER_VERSION,
  useLedgerSupportContext,
} from '@src/contexts/LedgerSupportProvider';

const StyledNumberList = styled(Typography)`
  display: block;
  background-color: ${({ theme }) => theme.colors.bg3};
  height: 24px;
  width: 24px;
  border-radius: 50%;
  text-align: center;
  padding: 0 6px;
  margin-right: 16px;
`;

export function Ledger({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { hasLedgerTransport } = useLedgerSupportContext();

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Ledger'}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <HorizontalFlex
          justify="space-between"
          align="center"
          padding="16px 16px"
          marginTop="16px"
          background={theme.colors.bg3}
        >
          <Typography height="24px">Status</Typography>
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
        {!hasLedgerTransport && (
          <VerticalFlex width="100%" padding="16px 20px">
            <Typography padding="0 0 24px 0" height="24px" weight={600}>
              To connect:
            </Typography>
            <HorizontalFlex>
              <StyledNumberList height="24px">1.</StyledNumberList>
              <Typography height="24px" margin="0 0 24px 0">
                Connect the Ledger device to your computer.
              </Typography>
            </HorizontalFlex>

            <HorizontalFlex>
              <StyledNumberList height="24px">2.</StyledNumberList>
              <Typography height="24px" margin="0 0 24px 0">
                Enter your PIN and access your device.
              </Typography>
            </HorizontalFlex>

            <HorizontalFlex>
              <StyledNumberList height="24px">3.</StyledNumberList>
              <Typography height="24px">
                Ensure you have installed the{' '}
                <b>Avalanche App v{SUPPORTED_LEDGER_VERSION}</b> (or above) and
                open it on your device.
              </Typography>
            </HorizontalFlex>

            <HorizontalSeparator margin="24px 0" />

            <Typography size={14} height="17px">
              If you do not have the Avalanche app on your Ledger, please add it
              through the Ledger Live app manager. More instructions can be
              found here.
            </Typography>
          </VerticalFlex>
        )}
      </Scrollbars>
    </VerticalFlex>
  );
}
