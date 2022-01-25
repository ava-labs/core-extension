import { useState } from 'react';
import {
  VerticalFlex,
  Typography,
  Mnemonic,
  PrimaryButton,
  TextButton,
  Checkbox,
  ComponentSize,
  HorizontalFlex,
  CaretIcon,
  IconDirection,
  CloseIcon,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';

interface CopyPhraseProps {
  mnemonic: string;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function CopyPhrase({
  onCancel,
  onBack,
  onNext,
  mnemonic,
}: CopyPhraseProps) {
  const theme = useTheme();
  const [termsConfirmed, setTermsConfirmed] = useState<boolean>(false);

  return (
    <VerticalFlex width="100%" align="center">
      <HorizontalFlex width="100%" justify="space-between" align="center">
        <TextButton onClick={onBack}>
          <CaretIcon
            direction={IconDirection.LEFT}
            height="18px"
            color={theme.colors.icon1}
          />
        </TextButton>
        <Typography as="h1" size={24} weight={700} height="29px">
          Secret Recovery Phrase
        </Typography>
        <TextButton onClick={onCancel}>
          <CloseIcon height="18px" color={theme.colors.icon1} />
        </TextButton>
      </HorizontalFlex>
      <VerticalFlex align="center" grow="1">
        <Typography align="center" margin="8px 0 40px" height="24px">
          This is your recovery phrase. Write it down
          <br />
          and store it in a secure location.
        </Typography>
        <Mnemonic
          phrase={mnemonic}
          confirmMnemonic={false}
          onConfirmedChange={() => {
            //noop, confirmation is next step
          }}
        />
      </VerticalFlex>
      <VerticalFlex align="center">
        <Checkbox
          label={`I understand losing this phrase will result in lost funds.\nI have stored it in a secure location`}
          onChange={setTermsConfirmed}
        />
        <PrimaryButton
          size={ComponentSize.LARGE}
          margin="16px 0"
          disabled={!termsConfirmed}
          onClick={() => onNext()}
        >
          I wrote it down
        </PrimaryButton>

        <TextButton as="a" margin="10px 0 0">
          Learn more
        </TextButton>
      </VerticalFlex>
    </VerticalFlex>
  );
}
