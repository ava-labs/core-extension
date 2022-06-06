import {
  VerticalFlex,
  HorizontalFlex,
  LedgerIcon,
  RecoveryLockIcon,
  VerticalSeparator,
  Typography,
} from '@avalabs/react-components';
import { OnboardButton } from './components/OnboardButton';
import styled, { useTheme } from 'styled-components';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { BetaLabel } from '@src/components/icons/BetaLabel';

interface ChooseExistingTypeProps {
  onNext: (isImportFlow: boolean) => void;
  onBack(): void;
  onCancel(): void;
}

const StyledLogo = styled.img`
  width: 260px;
`;

export function ChooseExistingType({
  onNext,
  onBack,
  onCancel,
}: ChooseExistingTypeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader onBack={onBack} onClose={onCancel} />
      <VerticalFlex justify="center" align="center" margin="0 0 4px">
        <StyledLogo src={'/images/OwlAnimation-still.svg'} />
        <HorizontalFlex justify="flex-end" width="100%" margin="0 0 0">
          <BetaLabel />
        </HorizontalFlex>
      </VerticalFlex>
      <Typography
        weight="bold"
        color={theme.colors.text1}
        size={20}
        margin="0 0 12px"
      >
        Access using...
      </Typography>
      <VerticalFlex align="center">
        <HorizontalFlex>
          <OnboardButton title="Recovery Phrase" onClick={() => onNext(true)}>
            <RecoveryLockIcon color={theme.colors.icon1} height="56px" />
          </OnboardButton>
          <VerticalSeparator margin="0 24px" />
          <OnboardButton
            title="Ledger"
            onClick={() => {
              onNext(false);
            }}
          >
            <LedgerIcon color={theme.colors.icon1} height="56px" />
          </OnboardButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
