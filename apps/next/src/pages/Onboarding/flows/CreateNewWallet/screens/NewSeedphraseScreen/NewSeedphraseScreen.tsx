import { Trans, useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Paper,
  Stack,
  toast,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';

import { createNewMnemonic } from '@core/common';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { SeedphraseGrid } from './components/SeedphraseGrid';

type NewSeedphraseScreenProps = OnboardingScreenProps & {
  onNext: (phrase: string) => void;
};

export const NewSeedphraseScreen: FC<NewSeedphraseScreenProps> = ({
  step,
  totalSteps,
  onNext,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();
  const [generatedSeedphrase] = useState<string>(createNewMnemonic());
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const handleNextClick = () => {
    onNext(generatedSeedphrase);
  };

  return (
    <>
      <FullscreenModalTitle>
        {t(`Here is your wallet's recovery phrase`)}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(`This phrase is your access key to your wallet.`)}
      </FullscreenModalDescription>
      <FullscreenModalContent>
        <SeedphraseGrid phrase={generatedSeedphrase} />
        <Stack alignItems="center" mt={1.5}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(generatedSeedphrase);
              toast.success(t('Phrase copied'), {
                duration: 2000,
              });
            }}
          >
            {t('Copy phrase')}
          </Button>
        </Stack>
        <Paper
          sx={{
            mt: 5,
            borderRadius: theme.shape.mediumBorderRadius,
            p: 1.75,
          }}
        >
          <Stack direction="row" columnGap={1}>
            <Checkbox
              checked={isTermsAccepted}
              onChange={(e) => {
                setIsTermsAccepted(e.target.checked);
              }}
            />
            <Typography variant="body2" minHeight={24}>
              <Trans i18nKey="I understand losing this phrase will result in lost funds.<br/>I have stored it in a secure place" />
            </Typography>
          </Stack>
        </Paper>
      </FullscreenModalContent>
      <FullscreenModalActions gap={6} pt={2}>
        <NavButton
          color="primary"
          onClick={handleNextClick}
          disabled={!isTermsAccepted}
        >
          {t('Next')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
