import { useCallback, useEffect, useState } from 'react';
import {
  useKeystoneUsbContext,
  useAnalyticsContext,
  useGetAvaxBalance,
} from '@core/ui';
import { DerivationPath, getAddressFromXPub } from '@avalabs/core-wallets-sdk';
import { PubKeyType } from '@core/types';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { DerivedAddresses } from '@/pages/Onboarding/components/DerivedAddresses';
import { ChainIDAlias } from '@keystonehq/hw-app-avalanche';

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

export interface KeystoneConnectorData {
  xpub: string;
  xpubXP: string;
  publicKeys: PubKeyType[] | undefined;
  hasPublicKeys: boolean;
  pathSpec: DerivationPath;
  masterFingerprint: string;
}

interface KeystoneConnectorProps {
  onSuccess: (data: KeystoneConnectorData) => void;
}

export function KeystoneConnector({ onSuccess }: KeystoneConnectorProps) {
  const theme = useTheme();
  const { capture } = useAnalyticsContext();
  const {
    getMasterFingerprint,
    getExtendedPublicKey,
    popDeviceSelection,
    hasKeystoneTransport,
    wasTransportAttempted,
    initKeystoneTransport,
  } = useKeystoneUsbContext();
  const { getAvaxBalance } = useGetAvaxBalance();

  const [publicKeyState, setPublicKeyState] = useState<KeystoneStatus>(
    KeystoneStatus.KEYSTONE_UNINITIATED,
  );

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const { t } = useTranslation();

  const getAddressFromXpubKey = useCallback(
    async (
      xpubValue: string,
      accountIndex: number,
      addressList: AddressType[] = [],
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
        capture('OnboardingKeystone3Connected');
        setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTED);
        setHasPublicKeys(true);
      }
    },
    [capture, getAvaxBalance],
  );

  const getXPublicKey = useCallback(async () => {
    try {
      const mfp = await getMasterFingerprint();
      const xpubValue = await getExtendedPublicKey(ChainIDAlias.C, 0);
      const xpubXPValue = await getExtendedPublicKey(ChainIDAlias.X, 0);
      capture('OnboardingKeystone3Connected');
      onSuccess({
        xpub: xpubValue,
        xpubXP: xpubXPValue,
        publicKeys: undefined,
        hasPublicKeys: true,
        pathSpec: DerivationPath.BIP44,
        masterFingerprint: mfp,
      });
      setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTED);
      await getAddressFromXpubKey(xpubValue, 0);
    } catch {
      capture('OnboardingKeystone3ConnectionFailed');
      setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTION_FAILED);
      popDeviceSelection();
    }
  }, [
    getMasterFingerprint,
    capture,
    getAddressFromXpubKey,
    getExtendedPublicKey,
    onSuccess,
    popDeviceSelection,
  ]);

  const getDerivationPathValue = useCallback(async () => {
    await initKeystoneTransport();
  }, [initKeystoneTransport]);

  useEffect(() => {
    initKeystoneTransport();
  }, [initKeystoneTransport]);

  const tryPublicKey = useCallback(async () => {
    capture('OnboardingKeystone3Retry');
    setPublicKeyState(KeystoneStatus.KEYSTONE_LOADING);
    if (!hasKeystoneTransport) {
      await initKeystoneTransport();
    }
    await getXPublicKey();
    return;
  }, [capture, getXPublicKey, hasKeystoneTransport, initKeystoneTransport]);

  useEffect(() => {
    const retrieveKeys = async () => {
      setPublicKeyState(KeystoneStatus.KEYSTONE_LOADING);
      await getXPublicKey();
    };
    if (hasPublicKeys) {
      return;
    }

    if (
      hasKeystoneTransport &&
      publicKeyState === KeystoneStatus.KEYSTONE_UNINITIATED
    ) {
      retrieveKeys();
    } else if (!hasKeystoneTransport) {
      if (
        wasTransportAttempted &&
        publicKeyState !== KeystoneStatus.KEYSTONE_CONNECTION_FAILED
      ) {
        setPublicKeyState(KeystoneStatus.KEYSTONE_CONNECTION_FAILED);
      } else {
        getDerivationPathValue();
      }
    }
  }, [
    hasKeystoneTransport,
    publicKeyState,
    hasPublicKeys,
    getDerivationPathValue,
    wasTransportAttempted,
    getXPublicKey,
  ]);

  return (
    <Stack>
      {publicKeyState === KeystoneStatus.KEYSTONE_CONNECTED && (
        <DerivedAddresses addresses={addresses} balanceSymbol="AVAX" />
      )}
      {publicKeyState === KeystoneStatus.KEYSTONE_CONNECTION_FAILED && (
        <Stack sx={{ mt: 1, rowGap: 3, width: theme.spacing(44) }}>
          <Stack direction="row">
            <Typography
              variant="caption"
              sx={{ color: theme.palette.error.main }}
            >
              {t(
                'Please reconnect the Keystone on home screen and reauthorize.',
              )}
            </Typography>
          </Stack>
          <Button onClick={() => tryPublicKey()} fullWidth>
            {t('Retry')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
