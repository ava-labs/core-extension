import { Page } from '@/components/Page';
import { LessRoundedPasswordField } from '@/components/StandaloneField';
import { WarningMessage } from '@/components/WarningMessage';
import { useSubmitButton } from '@/hooks/useSubmitButton';
import { MIN_PASSWORD_LENGTH } from '@/pages/Settings/constants';
import {
  Button,
  CircularProgress,
  Collapse,
  Fade,
  Stack,
  StackProps,
} from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevealPhrase } from '../../hooks/useRevealPhrase';
import { PhraseCard } from '../PhraseCard';

const contentProps: StackProps = {
  gap: 2,
  width: 1,
  justifyContent: undefined,
  alignItems: undefined,
};

export const MnemonicFlow: FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [submitButtonRef, shortcuts] = useSubmitButton();

  const { onPhraseReveal, recoveryPhrase, isAuthorized, error, isFetching } =
    useRevealPhrase(password);

  const invalidPassword = error === 'Password invalid';

  return (
    <Page
      title={t('Recovery phrase')}
      description={t(
        'This phrase is your access key to your wallet. Carefully write it down and store it in a safe location',
      )}
      contentProps={contentProps}
    >
      <WarningMessage>
        {t('Losing this phrase will result in lost funds')}
      </WarningMessage>

      <LessRoundedPasswordField
        value={password}
        disabled={isFetching}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('Enter password')}
        error={!!error}
        helperText={
          error
            ? invalidPassword
              ? t('Please enter a valid password')
              : t('Unknown error. Please try again')
            : t('Enter your password to view your recovery phrase')
        }
        fullWidth
        {...shortcuts}
      />

      <Fade in={isFetching} mountOnEnter unmountOnExit>
        <Stack flexGrow={1} alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      </Fade>

      <Collapse in={isAuthorized}>
        {recoveryPhrase && <PhraseCard phrase={recoveryPhrase} />}
      </Collapse>

      <Collapse in={!isAuthorized && !isFetching} sx={{ mt: 'auto' }}>
        <Button
          variant="contained"
          size="extension"
          fullWidth
          disabled={
            !password || password.length < MIN_PASSWORD_LENGTH || isFetching
          }
          onClick={onPhraseReveal}
          ref={submitButtonRef}
        >
          {t('Show recovery phrase')}
        </Button>
      </Collapse>
    </Page>
  );
};
