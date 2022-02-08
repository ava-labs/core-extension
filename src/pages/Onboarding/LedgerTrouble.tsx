import {
  VerticalFlex,
  Typography,
  TextButton,
  HorizontalFlex,
  HorizontalSeparator,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { SUPPORTED_LEDGER_VERSION } from '@src/contexts/LedgerSupportProvider';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';

interface LedgerTroubleProps {
  onBack(): void;
}

const TermsButton = styled(TextButton)`
  height: 48px;
  font-size: 14px;
`;

const StyledNumberList = styled(Typography)`
  display: block;
  background-color: ${({ theme }) => theme.colors.bg3};
  line-height: 24px;
  height: 24px;
  width: 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50%;
  text-align: center;
  padding: 0 6px;
  margin-right: 16px;
`;

const Link = styled(Typography)`
  text-decoration: underline;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`;

export function LedgerTrouble({ onBack }: LedgerTroubleProps) {
  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader title="Trouble Connecting" onClose={onBack} />
      <VerticalFlex justify="center" margin="0 0 40px 0">
        <Typography align="center" margin="8px 0 0" size={14} height="17px">
          We&apos;re having trouble connection to
          <br />
          your device.
        </Typography>
      </VerticalFlex>

      <VerticalFlex width="361px" margin="32px 0 0">
        <HorizontalFlex margin="0 0 24px 0">
          <StyledNumberList>1.</StyledNumberList>
          <Typography size={14} height="17px">
            Connected the Ledger device to your computer.
          </Typography>
        </HorizontalFlex>

        <HorizontalFlex margin="0 0 24px 0">
          <StyledNumberList>2.</StyledNumberList>
          <Typography size={14} height="17px">
            Enter your PIN and access your device.
          </Typography>
        </HorizontalFlex>

        <HorizontalFlex>
          <StyledNumberList>3.</StyledNumberList>
          <Typography size={14} height="17px">
            Ensure you have installed the{' '}
            <b>Avalanche App v{SUPPORTED_LEDGER_VERSION}</b> (or above) and open
            it on your device.
          </Typography>
        </HorizontalFlex>

        <HorizontalSeparator margin="32px 0" />

        <Typography size={14} height="22px">
          If you do not have the Avalanche app on your Ledger, please add it
          through the{' '}
          <Link
            as="a"
            href="https://www.ledger.com/ledger-live"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ledger Live
          </Link>{' '}
          app manager. The minimum version requried to use the app is version{' '}
          {SUPPORTED_LEDGER_VERSION}, more instructions can be found{' '}
          <Link
            as="a"
            href="https://docs.avax.network/learn/setup-your-ledger-nano-s-with-avalanche/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </Link>
          .
        </Typography>
      </VerticalFlex>

      <VerticalFlex align="center" flex={1} justify="flex-end">
        <TermsButton as="a">Learn more on how to upgrade</TermsButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
