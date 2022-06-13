import {
  ConnectionIndicator,
  HorizontalFlex,
  HorizontalSeparator,
  SecondaryDropDownMenuItem,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SettingsPageProps } from '../models';
import { SettingsHeader } from '../SettingsHeader';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import {
  SUPPORTED_LEDGER_VERSION,
  useLedgerContext,
} from '@src/contexts/LedgerProvider';

const StyledNumberList = styled(Typography)`
  font-size: 14px;
  display: block;
  background-color: ${({ theme }) => theme.colors.bg3};
  height: 24px;
  width: 24px;
  min-width: 24px;
  line-height: 24px;
  border-radius: 50%;
  text-align: center;
  padding: 0 6px;
  margin-right: 16px;
`;

export function Ledger({ goBack, navigateTo, width }: SettingsPageProps) {
  const theme = useTheme();
  const { hasLedgerTransport } = useLedgerContext();

  return (
    <VerticalFlex width={width} background={theme.colors.bg2} height="100%">
      <SettingsHeader
        width={width}
        goBack={goBack}
        navigateTo={navigateTo}
        title={'Ledger'}
      />
      <Scrollbars style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}>
        <SecondaryDropDownMenuItem
          selected={hasLedgerTransport}
          justify="space-between"
          align="center"
          padding="10px 16px"
          margin="16px 0 0"
          background={theme.colors.bg3}
        >
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
        </SecondaryDropDownMenuItem>
        {!hasLedgerTransport && (
          <VerticalFlex width="100%" padding="0 16px">
            <Typography
              padding="10px 0"
              margin="0 0 16px"
              size={14}
              height="17px"
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
                Ensure you have installed the{' '}
                <strong>Avalanche App v{SUPPORTED_LEDGER_VERSION}</strong> (or
                above) and open it on your device.
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
