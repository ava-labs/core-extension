import { useCallback, useEffect, useState } from 'react';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import {
  Avalanche,
  DerivationPath,
  getAddressFromXPub,
  getEvmAddressFromPubKey,
} from '@avalabs/core-wallets-sdk';
import { useGetAvaxBalance } from '@src/hooks/useGetAvaxBalance';
import { PubKeyType } from '@src/background/services/wallet/models';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { DerivationPathDropdown } from '@src/pages/Onboarding/components/DerivationPathDropDown';
import { DerivedAddresses } from '@src/pages/Onboarding/components/DerivedAddresses';

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

export interface LedgerConnectorData {
  xpub: string;
  xpubXP: string;
  publicKeys: PubKeyType[] | undefined;
  hasPublicKeys: boolean;
  pathSpec: DerivationPath;
}

interface LedgerConnectorProps {
  onSuccess: (data: LedgerConnectorData) => void;
  onTroubleshoot: () => void;
}

export function LedgerConnector({
  onSuccess,
  onTroubleshoot,
}: LedgerConnectorProps) {
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
    setAddresses([]);
    setHasPublicKeys(false);
    setPathSpec(DerivationPath.BIP44);
  };

  const getAddressFromXpubKey = useCallback(
    async (
      xpubValue: string,
      accountIndex: number,
      addressList: AddressType[] = []
    ) => {
      const address = getAddressFromXPub(xpubValue, accountIndex);
      const { balance } = await getAvaxBalance(address);
      const newAddresses = [
        ...addressList,
        { address, balance: balance.balanceDisplayValue || '0' },
      ];
      setAddresses(newAddresses);
      if (accountIndex < 2) {
        await getAddressFromXpubKey(xpubValue, accountIndex + 1, newAddresses);
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
      const xpubValue = await getExtendedPublicKey();
      const xpubXPValue = await getExtendedPublicKey(
        Avalanche.LedgerWallet.getAccountPath('X')
      );
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
      capture('OnboardingLedgerConnected');
      await getAddressFromXpubKey(xpubValue, 0);
      onSuccess({
        xpub: xpubValue,
        xpubXP: xpubXPValue,
        publicKeys: undefined,
        hasPublicKeys: true,
        pathSpec: DerivationPath.BIP44,
      });
    } catch {
      capture('OnboardingLedgerConnectionFailed');
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
      popDeviceSelection();
    }
  }, [
    capture,
    getAddressFromXpubKey,
    getExtendedPublicKey,
    onSuccess,
    popDeviceSelection,
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
          const publicKeyValue = [
            ...pubKeys,
            { evm: pubKey.toString('hex'), xp: pubKeyXP.toString('hex') },
          ];
          setHasPublicKeys(true);
          onSuccess({
            xpub: '',
            xpubXP: '',
            publicKeys: publicKeyValue,
            hasPublicKeys: true,
            pathSpec: DerivationPath.LedgerLive,
          });
        }
      } catch {
        capture('OnboardingLedgerConnectionFailed');
        setPublicKeyState(LedgerStatus.LEDGER_CONNECTION_FAILED);
        popDeviceSelection();
      }
    },
    [capture, getAvaxBalance, getPublicKey, onSuccess, popDeviceSelection]
  );

  const tryPublicKey = useCallback(async () => {
    capture('OnboardingLedgerRetry');
    setPublicKeyState(LedgerStatus.LEDGER_LOADING);
    setDropdownDisabled(true);

    if (!hasLedgerTransport) {
      // make sure we have a transport
      await initLedgerTransport();
    }
    if (pathSpec === DerivationPath.BIP44) {
      await getXPublicKey();
      setDropdownDisabled(false);
      return;
    }
    if (pathSpec === DerivationPath.LedgerLive) {
      setAddresses([]);
      await getPubKeys(pathSpec);
      setDropdownDisabled(false);
      return;
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
      setDropdownDisabled(true);
      if (selectedPathSpec === DerivationPath.LedgerLive) {
        setAddresses([]);
        await getPubKeys(selectedPathSpec);
        setDropdownDisabled(false);
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

  return (
    <Stack>
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
                  i18nKey="Unable to connect. View the troubleshoot guide <linkText>here</linkText>"
                  components={{
                    linkText: (
                      <span
                        onClick={() => onTroubleshoot()}
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
  );
}