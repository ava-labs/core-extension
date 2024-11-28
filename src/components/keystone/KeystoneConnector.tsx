import { useCallback, useEffect, useState } from 'react';
import { useKeystoneContext } from '@src/contexts/KeystoneUsbProvider';
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
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';

export interface AddressType {
  address: string;
  balance: string;
}

export enum KeystoneStatus {
  KEYSTONE_UNINITIATED = 'uninitiated',
  KEYSTONE_LOADING = 'loading',
  KEYSTONE_CONNECTED = 'connected',
  KEYSTONE_CONNECTION_FAILED = 'failed',
}

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
const WAIT_1500_MILLI_FOR_USER = 1500;

export interface KeystoneConnectorData {
  xpub: string;
  xpubXP: string;
  publicKeys: PubKeyType[] | undefined;
  hasPublicKeys: boolean;
  pathSpec: DerivationPath;
}

interface KeystoneConnectorProps {
  onSuccess: (data: KeystoneConnectorData) => void;
  onTroubleshoot: () => void;
}

export function KeystoneConnector({
  onSuccess,
  onTroubleshoot,
}: KeystoneConnectorProps) {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const {
    getExtendedPublicKey,
    popDeviceSelection,
    hasLedgerTransport,
    wasTransportAttempted,
    initKeystoneTransport,
    getPublicKey,
  } = useKeystoneContext();
  const { getAvaxBalance } = useGetAvaxBalance();

  const [publicKeyState, setPublicKeyState] = useState<KeystoneStatus>(
    KeystoneStatus.KEYSTONE_UNINITIATED
  );

  const [pathSpec, setPathSpec] = useState<DerivationPath>(
    DerivationPath.BIP44
  );
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const [dropdownDisabled, setDropdownDisabled] = useState(true);
  const { t } = useTranslation();

  const resetStates = () => {
    setPublicKeyState(KeystoneStatus.KEYSTONE_LOADING);
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
        setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTED);
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
      setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTED);
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
      setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTION_FAILED);
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
      await initKeystoneTransport();
    },
    [initKeystoneTransport]
  );

  useEffect(() => {
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  const getPubKeys = useCallback(
    async (
      derivationPathSpec: DerivationPath,
      accountIndex = 0,
      addressList: AddressType[] = [],
      pubKeys: PubKeyType[] = []
    ) => {
      try {
        console.log('accountIndex', accountIndex);
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
          setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTED);
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
        setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTION_FAILED);
        popDeviceSelection();
      }
    },
    [capture, getAvaxBalance, getPublicKey, onSuccess, popDeviceSelection]
  );

  const tryPublicKey = useCallback(async () => {
    console.error('trying public key');
    capture('OnboardingLedgerRetry');
    setPublicKeyState(KeystoneStatus.KEYSTONE_LOADING);
    setDropdownDisabled(true);
    if (!hasLedgerTransport) {
      console.error('no transport');
      // make sure we have a transport
      await initKeystoneTransport();
    } else {
      console.error('has transport');
    }
    if (pathSpec === DerivationPath.BIP44) {
      await getXPublicKey();
      setDropdownDisabled(false);
      return;
    }
    // if (pathSpec === DerivationPath.LedgerLive) {
    //   setAddresses([]);
    //   await getPubKeys(pathSpec);
    //   setDropdownDisabled(false);
    //   return;
    // }
  }, [
    capture,
    getPubKeys,
    getXPublicKey,
    hasLedgerTransport,
    initKeystoneTransport,
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
      setPublicKeyState(KeystoneStatus.KEYSTONE_LOADING);
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
      publicKeyState === KeystoneStatus.KEYSTONE_UNINITIATED
    ) {
      retrieveKeys(pathSpec);
    } else if (!hasLedgerTransport) {
      if (
        wasTransportAttempted &&
        publicKeyState !== KeystoneStatus.KEYSTONE_CONNECTION_FAILED
      ) {
        setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTION_FAILED);
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
          publicKeyState !== KeystoneStatus.KEYSTONE_UNINITIATED &&
          publicKeyState !== KeystoneStatus.KEYSTONE_CONNECTION_FAILED && (
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
        {publicKeyState === KeystoneStatus.KEYSTONE_CONNECTION_FAILED && (
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
