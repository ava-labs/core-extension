import { SolanaCaip2ChainId } from '@avalabs/core-chains-sdk';
import {
  Button,
  Card,
  CardContent,
  CheckCircleIcon,
  CircularProgress,
  HelpCircleIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import browser from 'webextension-polyfill';

import { MagicSolanaLogo } from '@/components/common/MagicSolanaLogo';
import { Overlay } from '@/components/common/Overlay';
import { PageTitle } from '@/components/common/PageTitle';
import {
  LedgerTroubleSteps,
  LedgerTroubleStepsFontVariant,
} from '@/components/ledger/LedgerTroublesSteps';
import { useAccountsContext } from '@core/ui';
import { useConnectionContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { useWalletContext } from '@core/ui';
import { useSolanaAddressInfo } from '@core/ui';
import { AppendSolanaPublicKeysHandler } from '@core/service-worker';
import { ExtensionRequest, NetworkWithCaipId } from '@core/types';
import { DerivedAddresses } from '../Onboarding/components/DerivedAddresses';
import { useSolanaPublicKeys } from '@core/ui';

import { FakeOnboardingBackground } from '@/components/common/FakeOnboardingBackground';
import { LedgerLiveSupportButton } from '@/components/ledger/LedgerLiveSupportButton';
import { DerivedAddressInfo, SolanaPublicKey } from './models';

type Step =
  | 'waiting'
  | 'troubleshooting'
  | 'fetching'
  | 'fetched'
  | 'done'
  | 'saving'
  | 'error'
  | 'nothing-to-add';

export const LedgerDeriveSolanaAddresses = () => {
  const { t } = useTranslation();
  const { request } = useConnectionContext();
  const { getAddressInfo } = useSolanaAddressInfo();
  const { getNetwork, isDeveloperMode } = useNetworkContext();
  const { walletDetails } = useWalletContext();
  const {
    accounts: { primary },
  } = useAccountsContext();

  const [solanaNetwork, setSolanaNetwork] = useState<NetworkWithCaipId>();
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step>('waiting');
  const [addresses, setAddresses] = useState<DerivedAddressInfo[]>([]);
  const [keys, setKeys] = useState<SolanaPublicKey[]>([]);
  const { retrieveKeys, status } = useSolanaPublicKeys();

  const accountsWithoutAddress = useMemo(() => {
    if (!primary || !walletDetails?.id) {
      return [];
    }

    const walletAccounts = primary[walletDetails.id];

    if (!walletAccounts) {
      return [];
    }

    return walletAccounts
      .filter((acc) => !acc.addressSVM)
      .map((acc) => acc.index);
  }, [primary, walletDetails?.id]);

  useEffect(() => {
    setSolanaNetwork(
      getNetwork(
        isDeveloperMode
          ? SolanaCaip2ChainId.DEVNET
          : SolanaCaip2ChainId.MAINNET,
      ),
    );
  }, [getNetwork, isDeveloperMode]);

  const savePublicKeys = useCallback(async () => {
    if (!walletDetails?.id) {
      return;
    }

    try {
      setStep('saving');

      await request<AppendSolanaPublicKeysHandler>({
        method: ExtensionRequest.SECRETS_APPEND_SOLANA_PUBLIC_KEYS,
        params: {
          publicKeys: keys,
          walletId: walletDetails?.id,
        },
      });

      setStep('done');
    } catch (err) {
      console.error(err);
      setError(t('An error occured while saving the public keys'));
      setStep('error');
    }
  }, [keys, request, t, walletDetails?.id]);

  const fetchBalances = useCallback(
    async (keysToFetch: SolanaPublicKey[]) => {
      setAddresses([]);
      setStep('fetching');

      for (const key of keysToFetch) {
        const addressInfo = await getAddressInfo(key.key);
        setAddresses((prev) => [...prev, addressInfo]);
      }

      setStep('fetched');
    },
    [getAddressInfo],
  );

  useEffect(() => {
    if (!solanaNetwork || !walletDetails || step !== 'waiting') {
      return;
    }

    let isMounted = true;

    if (status === 'ready') {
      if (!accountsWithoutAddress.length) {
        setStep('nothing-to-add');
        return;
      }

      retrieveKeys(accountsWithoutAddress).then((retrievedKeys) => {
        if (isMounted) {
          setKeys(retrievedKeys);
          fetchBalances(retrievedKeys);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [
    status,
    solanaNetwork,
    walletDetails,
    primary,
    retrieveKeys,
    t,
    step,
    fetchBalances,
    accountsWithoutAddress,
  ]);

  return (
    <>
      <FakeOnboardingBackground />
      <Overlay isBackgroundFilled={false}>
        <Card sx={{ display: 'flex', height: 600, width: 430 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            {step === 'waiting' && (
              <>
                <Stack
                  sx={{
                    gap: 2,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}
                >
                  <MagicSolanaLogo outerSize={320} innerSize={187} />
                  <Typography variant="h5">
                    {t(`Open the Solana app on your Ledger`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('Please unlock your hardware wallet')}
                  </Typography>
                  <CircularProgress size={40} />
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Trans
                    i18nKey="Unable to connect? See the troubleshooting guide <btn>here</btn>."
                    components={{
                      btn: (
                        <Button
                          variant="text"
                          size="small"
                          sx={{ p: 0, m: 0, minWidth: 0, height: 12, ml: 0.5 }}
                          onClick={() => setStep('troubleshooting')}
                        />
                      ),
                    }}
                  />
                </Typography>
              </>
            )}
            {step === 'troubleshooting' && (
              <Stack sx={{ flexGrow: 1, gap: 3 }}>
                <PageTitle onBackClick={() => setStep('waiting')}>
                  {t('Trouble Connecting')}
                </PageTitle>
                <Stack sx={{ px: 2, flexGrow: 1 }}>
                  <LedgerTroubleSteps
                    appName={t('Solana App')}
                    fontVariant={LedgerTroubleStepsFontVariant.large}
                  />
                </Stack>

                <Stack sx={{ p: 2 }}>
                  <Button onClick={() => setStep('waiting')}>
                    {t('Back')}
                  </Button>

                  <LedgerLiveSupportButton />
                </Stack>
              </Stack>
            )}
            {(step === 'fetching' ||
              step === 'fetched' ||
              step === 'saving') && (
              <>
                <PageTitle>{t('Add Solana Accounts')}</PageTitle>
                <Stack sx={{ flexGrow: 1 }}>
                  <DerivedAddresses
                    header={t('New addresses to be added')}
                    addresses={addresses}
                    numberOfExpectedAddresses={accountsWithoutAddress.length}
                    balanceSymbol="SOL"
                  />
                </Stack>
                <Button
                  fullWidth
                  size="large"
                  onClick={savePublicKeys}
                  disabled={step === 'fetching' || step === 'saving'}
                  isLoading={step === 'saving'}
                >
                  {t('Add addresses')}
                </Button>
              </>
            )}
            {error && (
              <>
                <Stack
                  sx={{
                    flexGrow: 1,
                    gap: 2,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {error}
                </Stack>
                <Button
                  color="primary"
                  onClick={() => {
                    browser.action.openPopup();
                    window.close();
                  }}
                  fullWidth
                >
                  {t('Close')}
                </Button>
              </>
            )}
            {step === 'nothing-to-add' && (
              <>
                <Stack
                  sx={{
                    flexGrow: 1,
                    gap: 2,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <HelpCircleIcon size={60} />
                  <Typography variant="h5">
                    {t('Nothing to do here')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      'All of your accounts already have Solana addresses added. Feel free to close this tab.',
                    )}
                  </Typography>
                </Stack>
                <Button
                  color="primary"
                  onClick={async () => {
                    browser.action.openPopup();
                    window.close();
                  }}
                  fullWidth
                >
                  {t('Close')}
                </Button>
              </>
            )}
            {step === 'done' && (
              <>
                <Stack
                  sx={{
                    height: 140,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <CheckCircleIcon size={32} sx={{ color: 'success.main' }} />
                  <Typography variant="h3">{t('Success')}</Typography>
                </Stack>

                <Stack
                  sx={{
                    height: 124,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t(
                      'Please close this tab and open the Core Browser Extension to see the newly added addresses.',
                    )}
                  </Typography>
                  <Button
                    onClick={() => {
                      browser.action.openPopup();
                      window.close();
                    }}
                    sx={{ width: '50%' }}
                  >
                    {t('Close')}
                  </Button>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      </Overlay>
    </>
  );
};
