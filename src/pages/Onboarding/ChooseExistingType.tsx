import {
  VerticalFlex,
  Typography,
  TextButton,
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  CloseIcon,
  LedgerIcon,
  RecoveryLockIcon,
} from '@avalabs/react-components';
import { LoginIllustration } from '@src/components/common/LoginIllustation';
import { OnboardButton } from './components/OnboardButton';
import { useTheme } from 'styled-components';

interface ChooseExistingTypeProps {
  onNext: (isImportFlow: boolean) => void;
  onBack(): void;
  onCancel(): void;
}

export function ChooseExistingType({
  onNext,
  onBack,
  onCancel,
}: ChooseExistingTypeProps) {
  const theme = useTheme();

  return (
    <VerticalFlex width="100%" align="center" justify="space-between">
      <HorizontalFlex width="100%" justify="space-between" align="center">
        <TextButton onClick={onBack}>
          <CaretIcon
            direction={IconDirection.LEFT}
            height="18px"
            color={theme.colors.icon1}
          />
        </TextButton>

        <Typography as="h1" size={24} weight={700} height="29px">
          Access using...
        </Typography>
        <TextButton onClick={onCancel}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>

      <VerticalFlex justify="center" grow="1">
        <LoginIllustration size={182} variant="secondary" />
      </VerticalFlex>
      <VerticalFlex align="center" margin="0 0 64px 0">
        <HorizontalFlex>
          <OnboardButton margin="0 24px 0 0" onClick={() => onNext(true)}>
            <Typography margin="24px 0 68px 0" size={18} weight={600}>
              Recovery phrase
            </Typography>
            <RecoveryLockIcon color={theme.colors.icon1} height="80px" />
          </OnboardButton>

          <OnboardButton
            onClick={() => {
              onNext(false);
            }}
          >
            <Typography margin="24px 0 68px 0" size={18} weight={600}>
              Ledger
            </Typography>
            <LedgerIcon color={theme.colors.icon1} height="80px" />
          </OnboardButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
