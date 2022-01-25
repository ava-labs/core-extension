import {
  VerticalFlex,
  Typography,
  TextButton,
  HorizontalFlex,
  CloseIcon,
  HorizontalSeparator,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { SUPPORTED_LEDGER_VERSION } from '@src/contexts/LedgerSupportProvider';

interface LedgerTroubleProps {
  onBack(): void;
}

const TermsButton = styled(TextButton)`
  height: 24px;
`;

const StyledCloseButton = styled(TextButton)`
  position: absolute;
  right: 0;
`;

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

export function LedgerTrouble({ onBack }: LedgerTroubleProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center">
      <HorizontalFlex
        width="100%"
        justify="center"
        align="center"
        margin="0 0 16px 0"
        position="relative"
      >
        <Typography as="h1" size={24} weight={700} height="29px">
          Trouble Connecting
        </Typography>
        <StyledCloseButton onClick={onBack}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </StyledCloseButton>
      </HorizontalFlex>
      <VerticalFlex justify="center" margin="0 0 40px 0">
        <Typography align="center" height="24px">
          We&apos;re having trouble connection
          <br />
          to your device.
        </Typography>
      </VerticalFlex>

      <VerticalFlex width="361px">
        <HorizontalFlex>
          <StyledNumberList height="24px">1.</StyledNumberList>
          <Typography height="24px" margin="0 0 24px 0">
            Connected the Ledger device to your computer.
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
          <Typography height="24px" margin="0 0 24px 0">
            Ensure you have installed the{' '}
            <b>Avalanche App v{SUPPORTED_LEDGER_VERSION}</b> (or above) and open
            it on your device.
          </Typography>
        </HorizontalFlex>

        <HorizontalSeparator margin="32px 0" />

        <Typography size={14} height="24px">
          If you do not have the Avalanche app on your Ledger, please add it
          through the <b>Ledger Live</b> app manager. The minimum version
          requried to use the app is version {SUPPORTED_LEDGER_VERSION}, more
          instructions can be found <b>here.</b>
        </Typography>
      </VerticalFlex>

      <VerticalFlex align="center" flex={1} justify="flex-end">
        <TermsButton as="a">Learn more on how to upgrade</TermsButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
