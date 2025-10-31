import { FC } from 'react';
import { Button } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

import { Page } from '@/components/Page';
import { SlideUpDialog } from '@/components/Dialog';

import { PolicyRegistrationState } from './types';
import { usePolicyRegistrationState } from './hooks';
import { ConfirmPublicKey, SetupWalletPolicy } from './components';

const pageProps = {
  descriptionProps: {
    maxWidth: '90%',
  },
  contentProps: {
    width: '100%',
    justifyContent: 'space-between',
  },
};

export const LedgerRegisterBtcWalletPolicy: FC = () => {
  const { t } = useTranslation();

  const { status, xpub, dismiss, policyName, policyDerivationPath } =
    usePolicyRegistrationState();

  const isPubkeyPhase = status.startsWith('pubkey:');
  const phase = isPubkeyPhase ? 'pubkey' : 'policy';

  const Content = ComponentByPhase[phase];

  console.log('DEBUG status', status, policyName);

  return (
    <SlideUpDialog open={status !== 'idle' && status !== 'dismissed'}>
      <Page
        withBackButton
        onBack={dismiss}
        title={
          isPubkeyPhase
            ? t('Please confirm the public key displayed on your Ledger')
            : t('Set up a wallet policy in the Bitcoin app')
        }
        description={
          isPubkeyPhase
            ? ''
            : t(
                'Ledger requires you to set up a wallet policy in the Bitcoin app. Please approve or reject this action on your Ledger device.',
              )
        }
        {...pageProps}
      >
        <Content
          status={status}
          xpub={xpub}
          policyName={policyName}
          policyDerivationPath={policyDerivationPath}
          dismiss={dismiss}
        />
        <Button
          variant="contained"
          color={status === 'policy:success' ? 'primary' : 'secondary'}
          size="extension"
          fullWidth
          onClick={dismiss}
          loading={status.endsWith(':pending')}
          disabled={status.endsWith(':pending')}
        >
          {status === 'policy:success'
            ? t('Done')
            : status.endsWith(':pending')
              ? t('Waiting for approval...')
              : t('Dismiss')}
        </Button>
      </Page>
    </SlideUpDialog>
  );
};

const ComponentByPhase: Record<
  'pubkey' | 'policy',
  FC<PolicyRegistrationState>
> = {
  pubkey: ConfirmPublicKey,
  policy: SetupWalletPolicy,
};
