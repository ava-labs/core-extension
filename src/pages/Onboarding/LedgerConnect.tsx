import { useCallback, useEffect, useState } from 'react';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { DerivationPathDropdown } from './components/DerivationPathDropDown';
import {
  Avalanche,
  DerivationPath,
  getAddressFromXPub,
  getEvmAddressFromPubKey,
} from '@avalabs/wallets-sdk';
import { DerivedAddresses } from './components/DerivedAddresses';
import { useGetAvaxBalance } from '@src/hooks/useGetAvaxBalance';
import { PubKeyType } from '@src/background/services/wallet/models';
import { Trans, useTranslation } from 'react-i18next';
import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';
import {
  Button,
  Divider,
  ExternalLinkIcon,
  InfoCircleIcon,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@avalabs/k2-components';
import { PageNav } from './components/PageNav';
interface LedgerConnectProps {
  onCancel(): void;
  onNext(): void;
  onError(): void;
}

export interface AddressType {
  address: string;
  balance: string;
}

export enum LedgerStatus {
  LEDGER_UNINITIATED = 'uninitiated',
  LEDGER_LOADING = 'loading',
  LEDGER_CONNECTED = 'connected',
  LEDGER_CONNECTION_FAILED = 'failed',
}

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
const WAIT_1500_MILLI_FOR_USER = 1500;

export function LedgerConnect({
  onCancel,
  onNext,
  onError,
}: LedgerConnectProps) {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const {
    getExtendedPublicKey,
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initLedgerTransport,
    getPublicKey,
  } = useLedgerContext();
  const { getAvaxBalance } = useGetAvaxBalance();
  const { setXpub, setXpubXP, setPublicKeys } = useOnboardingContext();
  const [publicKeyState, setPublicKeyState] = useState<LedgerStatus>(
    LedgerStatus.LEDGER_UNINITIATED
  );

  const [pathSpec, setPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44
  );
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const [dropdownDisabled, setDropdownDisabled] = useState(true);
  const { t } = useTranslation();

  const resetStates = () => {
    setPublicKeyState(LedgerStatus.LEDGER_LOADING);
    setXpub('');
    setPublicKeys([]);
    setAddresses([]);
    setHasPublicKeys(false);
    setPathSpec(DerivationPath.BIP44);
  };

  const getAddressFromXpubKey = useCallback(
    async (
      xpub: string,
      accountIndex: number,
      addressList: AddressType[] = []
    ) => {
      const address = getAddressFromXPub(xpub, accountIndex);
      const { balance } = await getAvaxBalance(address);
      const newAddresses = [
        ...addressList,
        { address, balance: balance.balanceDisplayValue || '0' },
      ];
      setAddresses(newAddresses);
      if (accountIndex < 2) {
        await getAddressFromXpubKey(xpub, accountIndex + 1, newAddresses);
      }
      if (accountIndex >= 2) {
        capture('OnboardingLedgerConnected');
        setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
        setHasPublicKeys(true);
      }
    },
    [capture, getAvaxBalance]
  );

  const getXPublicKey = useCallback(async () => {
    try {
      const xpub = await getExtendedPublicKey();
      setXpub(xpub);
      const xpubXP = await getExtendedPublicKey(
        Avalanche.LedgerWallet.getAccountPath('X')
      );
      setXpubXP(xpubXP);
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
      capture('OnboardingLedgerConnected');
      await getAddressFromXpubKey(xpub, 0);
    } catch {
      capture('OnboardingLedgerConnectionFailed');
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
      popDeviceSelection();
    }
  }, [
    capture,
    getAddressFromXpubKey,
    getExtendedPublicKey,
    popDeviceSelection,
    setXpub,
    setXpubXP,
  ]);

  const getDerivationPathValue = useCallback(
    async (derivationPathSpec: DerivationPath) => {
      if (!derivationPathSpec) {
        return;
      }
      await initLedgerTransport();
    },
    [initLedgerTransport]
  );

  useEffect(() => {
    initLedgerTransport();
  }, [initLedgerTransport]);

  const getPubKeys = useCallback(
    async (
      derivationPathSpec: DerivationPath,
      accountIndex = 0,
      addressList: AddressType[] = [],
      pubKeys: PubKeyType[] = []
    ) => {
      try {
        const pubKey = await getPublicKey(accountIndex, derivationPathSpec);
        const pubKeyXP = await getPublicKey(
          accountIndex,
          derivationPathSpec,
          'AVM'
        );
        const address = getEvmAddressFromPubKey(pubKey);
        const { balance } = await getAvaxBalance(address);
        const newAddresses = [
          ...addressList,
          { address, balance: balance.balanceDisplayValue || '0' },
        ];
        setAddresses(newAddresses);
        if (accountIndex < 2) {
          await getPubKeys(derivationPathSpec, accountIndex + 1, newAddresses, [
            ...pubKeys,
            { evm: pubKey.toString('hex'), xp: pubKeyXP.toString('hex') },
          ]);
        }
        if (accountIndex >= 2) {
          capture('OnboardingLedgerConnected');
          setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
          setPublicKeys([
            ...pubKeys,
            { evm: pubKey.toString('hex'), xp: pubKeyXP.toString('hex') },
          ]);
          setHasPublicKeys(true);
        }
      } catch {
        capture('OnboardingLedgerConnectionFailed');
        setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
        popDeviceSelection();
      }
    },
    [capture, getAvaxBalance, getPublicKey, popDeviceSelection, setPublicKeys]
  );

  const tryPublicKey = useCallback(async () => {
    capture('OnboardingLedgerRetry');
    setPublicKeyState(LedgerStatus.LEDGER_LOADING);

    if (!hasLedgerTransport) {
      // make sure we have a transport
      await initLedgerTransport();
    }
    if (pathSpec === DerivationPath.BIP44) {
      return getXPublicKey();
    }
    if (pathSpec === DerivationPath.LedgerLive) {
      setAddresses([]);
      return getPubKeys(pathSpec);
    }
  }, [
    capture,
    getPubKeys,
    getXPublicKey,
    hasLedgerTransport,
    initLedgerTransport,
    pathSpec,
  ]);

  const onPathSelected = async (selectedPathSpec: DerivationPath) => {
    resetStates();
    setPathSpec(selectedPathSpec);
    setDropdownDisabled(true);
    if (selectedPathSpec === DerivationPath.BIP44) {
      setTimeout(async () => {
        await getXPublicKey();
        setDropdownDisabled(false);
      }, WAIT_1500_MILLI_FOR_USER);
      return;
    }
    if (selectedPathSpec === DerivationPath.LedgerLive) {
      getDerivationPathValue(selectedPathSpec);
      await getPubKeys(selectedPathSpec);
      setDropdownDisabled(false);
    }
  };

  // Attempt to automatically connect using Ledger Live as soon as we
  // establish the transport.
  useEffect(() => {
    const retrieveKeys = async (selectedPathSpec: DerivationPath) => {
      setPublicKeyState(LedgerStatus.LEDGER_LOADING);
      if (selectedPathSpec === DerivationPath.LedgerLive) {
        setAddresses([]);
        await getPubKeys(selectedPathSpec);
      } else if (selectedPathSpec === DerivationPath.BIP44) {
        await getXPublicKey();
        setDropdownDisabled(false);
      }
    };
    if (hasPublicKeys) {
      return;
    }

    if (
      hasLedgerTransport &&
      publicKeyState === LedgerStatus.LEDGER_UNINITIATED
    ) {
      retrieveKeys(pathSpec);
    } else if (!hasLedgerTransport) {
      if (
        wasTransportAttempted &&
        publicKeyState !== LedgerStatus.LEDGER_CONNECTION_FAILED
      ) {
        setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
      } else {
        getDerivationPathValue(pathSpec);
      }
    }
  }, [
    pathSpec,
    hasLedgerTransport,
    publicKeyState,
    hasPublicKeys,
    getPubKeys,
    getDerivationPathValue,
    wasTransportAttempted,
    getXPublicKey,
  ]);

  const Content = (
    <Trans
      i18nKey="<typography>This process retrieves the addresses<br />from your ledger</typography>"
      components={{
        typography: <Typography variant="caption" />,
      }}
    />
  );

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <OnboardingStepHeader
        testId="connect-ledger"
        title={t('Connect your Ledger')}
        onClose={onCancel}
      />
      <Stack sx={{ flexGrow: 1, pt: 1, px: 6 }}>
        <Typography variant="body2">
          {t('Select a derivation path to see your derived addresses.')}
          <Tooltip
            title={Content}
            sx={{
              display: 'inline',
              cursor: 'pointer',
              pl: theme.spacing(1),
              verticalAlign: 'middle',
            }}
          >
            <InfoCircleIcon size={14} />
          </Tooltip>
        </Typography>
        <Stack
          sx={{
            width: theme.spacing(44),
            alignSelf: 'center',
            mt: 7.5,
          }}
        >
          <DerivationPathDropdown
            pathSpec={pathSpec}
            onPathSelected={onPathSelected}
            isDisabled={dropdownDisabled}
          />
          {pathSpec &&
            publicKeyState !== LedgerStatus.LEDGER_UNINITIATED &&
            publicKeyState !== LedgerStatus.LEDGER_CONNECTION_FAILED && (
              <Stack
                sx={{
                  mt: 4,
                  rowGap: 3,
                }}
              >
                <Divider flexItem />
                <DerivedAddresses
                  addresses={addresses}
                  hideLoadinSkeleton={pathSpec === DerivationPath.BIP44}
                />
              </Stack>
            )}
        </Stack>
        <Stack sx={{ alignItems: 'center' }}>
          {publicKeyState === LedgerStatus.LEDGER_CONNECTION_FAILED && (
            <Stack sx={{ mt: 1, rowGap: 3, width: theme.spacing(44) }}>
              <Stack direction="row">
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.error.main }}
                >
                  <Trans
                    i18nKey="Unable to connect, view the troubleshoot guide <linkText>here</linkText>"
                    components={{
                      linkText: (
                        <span
                          onClick={onError}
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            textDecorationColor: theme.palette.error.main,
                          }}
                        />
                      ),
                    }}
                  />
                </Typography>
              </Stack>
              <Button onClick={() => tryPublicKey()} fullWidth>
                {t('Retry')}
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
      <PageNav
        onBack={onCancel}
        onNext={onNext}
        disableNext={!hasPublicKeys}
        expand={true}
        steps={3}
        activeStep={0}
      >
        <Button
          variant="text"
          onClick={() => {
            window.open(
              'https://www.ledger.com/ledger-live',
              '_blank',
              'noreferrer'
            );
          }}
        >
          <ExternalLinkIcon size={16} sx={{ color: 'secondary.main' }} />
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              color: 'secondary.main',
            }}
          >
            {t('Ledger Live Support')}
          </Typography>
        </Button>
      </PageNav>

      <LedgerWrongVersionOverlay onClose={() => onCancel()} />
    </Stack>
  );
}
