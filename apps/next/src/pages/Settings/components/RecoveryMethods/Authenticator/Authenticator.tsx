import { Page } from '@/components/Page';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TotpResetChallenge } from '@core/types';
import { useState } from 'react';
import { useGoBack, useSeedlessMfaManager } from '@core/ui';
import browser from 'webextension-polyfill';
import { AuthenticatorVerifyScreen } from './AuthenticatorVerifyScreen';
import { SeedlessTotpQRCode } from '@/pages/Onboarding/flows/SeedlessFlow/screens';
import { AuthenticatorVerifyCode } from './AuthenticatorVerifyCode';

export const Authenticator: FC = () => {
  const { t } = useTranslation();
  const {
    initAuthenticatorChange,
    completeAuthenticatorChange,
    hasFidoConfigured,
    hasTotpConfigured,
  } = useSeedlessMfaManager();
  const [totpChallenge, setTotpChallenge] = useState<TotpResetChallenge>();
  const [showSecret, setShowSecret] = useState(false);
  console.log('totpChallenge: ', totpChallenge);
  const goBack = useGoBack();

  const initChange = useCallback(async () => {
    console.log('initChange: ');
    // if (hasFidoConfigured) {
    //   browser.tabs.create({
    //     url: `${ContextContainer.FULLSCREEN}#/update-recovery-methods`,
    //   });
    //   return;
    // }

    // setState(State.Initiated);
    try {
      console.log('try: ');
      const challenge = await initAuthenticatorChange();
      console.log('challenge: ', challenge);
      setTotpChallenge(challenge);
      // setState(State.Pending);
    } catch (e) {
      console.log('catch: ', e);
      setTotpChallenge(undefined);
      // setState(State.Failure);
    }
  }, [initAuthenticatorChange]);

  useEffect(() => {
    initChange();
  }, [initChange]);

  const totpSecret = useMemo(() => {
    if (!totpChallenge) {
      return '';
    }

    return new URL(totpChallenge.totpUrl).searchParams.get('secret') ?? '';
  }, [totpChallenge]);

  return (
    <Page
      title={t('Scan QR code')}
      withBackButton
      contentProps={{ justifyContent: 'flex-start' }}
    >
      <Typography variant="caption">
        {t(
          'Open any authenticator app and scan the QR code below or enter the code manually',
        )}
      </Typography>
      {totpChallenge && (
        <AuthenticatorVerifyScreen
          onBackClick={() => console.log('Back clicked')}
          totpChallenge={totpChallenge}
          onNextClick={() => console.log('Next clicked')}
          onShowSecret={() => setShowSecret(true)}
        />
      )}
      {showSecret && <AuthenticatorVerifyCode totpSecret={totpSecret} />}

      {/* <SeedlessTotpQRCode
				challengeUrl={totpChallenge?.totpUrl ?? ''}
				onNext={() => console.log('next')}
			/> */}
    </Page>
  );
};
