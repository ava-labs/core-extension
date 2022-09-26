import {
  VerticalFlex,
  Typography,
  HorizontalFlex,
  HorizontalSeparator,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { StyledNumberList } from '@src/components/common/StyledNumberList';

interface LedgerTroubleProps {
  onBack(): void;
}

const Link = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.secondary1};
`;

export function LedgerTrouble({ onBack }: LedgerTroubleProps) {
  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        testId="ledger-trouble"
        title="Trouble Connecting"
        onClose={onBack}
      />
      <VerticalFlex justify="center" margin="0 0 24px 0">
        <Typography align="center" margin="8px 0 0" size={14} height="17px">
          We&apos;re having trouble connecting to
          <br />
          your device.
        </Typography>
      </VerticalFlex>

      <VerticalFlex width="361px" margin="12px 0 0">
        <HorizontalFlex margin="0 0 24px 0">
          <StyledNumberList>1.</StyledNumberList>
          <Typography size={14} height="17px">
            Connect the Ledger device to your computer.
          </Typography>
        </HorizontalFlex>

        <HorizontalFlex margin="0 0 24px 0">
          <StyledNumberList>2.</StyledNumberList>
          <Typography size={14} height="17px">
            Enter your PIN.
          </Typography>
        </HorizontalFlex>

        <HorizontalFlex>
          <StyledNumberList>3.</StyledNumberList>
          <Typography size={14} height="17px">
            Ensure you have installed the latest{' '}
            <Typography weight="bold">Avalanche App</Typography> and open it on
            your device.
          </Typography>
        </HorizontalFlex>

        <HorizontalSeparator margin="32px 0" />

        <Typography size={14} height="22px">
          If you do not have the latest Avalanche App, please add it through the{' '}
          <Link
            as="a"
            href="https://www.ledger.com/ledger-live"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ledger Live
          </Link>{' '}
          app manager.
        </Typography>
        <Typography size={14} height="22px" margin="24px 0 0">
          More instructions can be found{' '}
          <Link
            as="a"
            href="https://support.avax.network/en/articles/6150237-how-to-use-a-ledger-nano-s-or-nano-x-with-avalanche"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </Link>
          .
        </Typography>
      </VerticalFlex>
    </VerticalFlex>
  );
}
