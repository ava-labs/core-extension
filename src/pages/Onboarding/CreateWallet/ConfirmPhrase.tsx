import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  TextButton,
  ComponentSize,
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  CloseIcon,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';

interface ConfirmPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConfirmPhrase({
  onCancel,
  onNext,
  onBack,
  mnemonic,
}: ConfirmPhraseProps) {
  const theme = useTheme();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);

  return (
    <VerticalFlex width="100%" align="center" padding="16px 0">
      <HorizontalFlex width="100%" justify="space-between" align="center">
        <TextButton onClick={onBack}>
          <CaretIcon
            direction={IconDirection.LEFT}
            height="18px"
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} height="29px">
          Verify Recovery Phrase
        </Typography>
        <TextButton onClick={onCancel}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 40px" height="24px">
          Select the words below to verify your
          <br />
          Recovery Phrase.
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={true}
          onConfirmedChange={(confirmed) => {
            setTermsConfirmed(confirmed);
          }}
        />
      </VerticalFlex>
      <VerticalFlex align="center" margin="0 0 40px">
        <PrimaryButton
          size={ComponentSize.LARGE}
          disabled={!termsConfirmed}
          onClick={() => onNext()}
        >
          Verify phrase
        </PrimaryButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
