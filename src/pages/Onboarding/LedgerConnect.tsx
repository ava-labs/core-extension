import { useCallback, useEffect, useState } from 'react';
import {
  VerticalFlex,
  Typography,
  InfoIcon,
  Tooltip,
  PrimaryButton,
  ComponentSize,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import {
  LedgerConnectCard,
  LedgerStatus,
} from './components/LedgerConnectCard';
import { useLedgerContext } from '@src/contexts/LedgerProvider';
import { OnboardingStepHeader } from './components/OnboardingStepHeader';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { DerivationPathDropdown } from './components/DerivationPathDropDown';
import {
  DerivationPath,
  getAddressDerivationPath,
  getAddressFromXPub,
  getEvmAddressFromPubKey,
} from '@avalabs/wallets-sdk';
import { DerivedAddresses } from './components/DerivedAddresses';
import { Network } from '@avalabs/chains-sdk';
import { useGetAvaxBalance } from '@src/hooks/useGetAvaxBalance';
import { useGetAvalancheNetwork } from '@src/hooks/useGetAvalancheNetwork';
import { PubKeyType } from '@src/background/services/wallet/models';
import { TFunction, Trans, useTranslation } from 'react-i18next';
import { LedgerWrongVersionOverlay } from '../Ledger/LedgerWrongVersionOverlay';

interface LedgerConnectProps {
  onCancel(): void;
  onBack(): void;
  onNext(): void;
  onError(): void;
}

export interface AddressType {
  address: string;
  balance: string;
}

const StyledTooltip = styled(Tooltip)`
  display: inline;
  padding: 0 0 0 8px;
  vertical-align: text-top;
  cursor: pointer;
`;

/**
 * Waiting this amount of time otherwise this screen would be a blip and the user wouldnt even know it happened
 */
const WAIT_1500_MILLI_FOR_USER = 1500;

const getConfirmAccountLabel = (
  confirmedAccountCount: number,
  t: TFunction<'translation', undefined>,
  pathSpec?: DerivationPath
) => {
  if (!pathSpec) {
    return;
  }
  if (pathSpec === DerivationPath.BIP44) {
    return t('Please confirm the action on your ledger device.');
  }
  const confirmActoinsLeft = 3 - confirmedAccountCount;
  const plural = 3 - confirmedAccountCount <= 1 ? 'time' : 'times';
  return t(
    `Please confirm the action {{count}} more {{plural}} on your ledger device.`,
    {
      count: confirmActoinsLeft,
      plural,
    }
  );
};

export function LedgerConnect({
  onBack,
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
  const { setXpub, setPublicKeys } = useOnboardingContext();
  const { getAvalancheNetwork } = useGetAvalancheNetwork();
  const [publicKeyState, setPublicKeyState] = useState<LedgerStatus>(
    LedgerStatus.LEDGER_UNINITIATED
  );

  const [pathSpec, setPathSpec] = useState<DerivationPath>(
    DerivationPath.LedgerLive
  );

  const [derivationPath, setDerivationPath] = useState('');
  const [confirmedAccountCount, setConfirmedAccountCount] = useState(0);
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [hasPublicKeys, setHasPublicKeys] = useState(false);
  const [avalancheNetwork, setAvalancheNetwork] = useState<Network>();
  const { t } = useTranslation();

  const resetStates = () => {
    setPublicKeyState(LedgerStatus.LEDGER_LOADING);
    setDerivationPath('');
    setXpub('');
    setPublicKeys([]);
    setAddresses([]);
    setConfirmedAccountCount(0);
    setHasPublicKeys(false);
    setPathSpec(DerivationPath.LedgerLive);
  };

  const getAddressFromXpubKey = useCallback(
    async (
      xpub: string,
      accountIndex: number,
      addresses: AddressType[] = []
    ) => {
      const address = getAddressFromXPub(xpub, accountIndex);
      const { balance } = await getAvaxBalance(address);
      const newAddresses = [
        ...addresses,
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
      setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
      capture('OnboardingLedgerConnected');
      getAddressFromXpubKey(xpub, 0);
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
  ]);

  const getDerivationPathValue = useCallback(
    async (pathSpec: DerivationPath) => {
      if (!pathSpec) {
        return;
      }
      await initLedgerTransport();
      const path = getAddressDerivationPath(0, pathSpec, 'EVM');

      setDerivationPath(path);
    },
    [initLedgerTransport]
  );

  useEffect(() => {
    const initLedger = async () => {
      await initLedgerTransport();
    };
    const initAvalancheNetwork = async () => {
      const { avalancheNetwork } = await getAvalancheNetwork();
      setAvalancheNetwork(avalancheNetwork);
    };
    initLedger();
    if (!avalancheNetwork) {
      initAvalancheNetwork();
    }
  }, [avalancheNetwork, getAvalancheNetwork, initLedgerTransport]);

  const getPubKeys = useCallback(
    async (
      pathSpec: DerivationPath,
      accountIndex = 0,
      addresses: AddressType[] = [],
      pubKeys: PubKeyType[] = []
    ) => {
      try {
        const derivationPath = getAddressDerivationPath(
          accountIndex,
          pathSpec,
          'EVM'
        );
        setDerivationPath(derivationPath);

        const pubKey = await getPublicKey(accountIndex, pathSpec);
        const address = getEvmAddressFromPubKey(pubKey);
        const { balance } = await getAvaxBalance(address);
        const newAddresses = [
          ...addresses,
          { address, balance: balance.balanceDisplayValue || '0' },
        ];
        setConfirmedAccountCount(accountIndex + 1);
        setAddresses(newAddresses);
        if (accountIndex < 2) {
          await getPubKeys(pathSpec, accountIndex + 1, newAddresses, [
            ...pubKeys,
            { evm: pubKey.toString('hex') },
          ]);
        }
        if (accountIndex >= 2) {
          capture('OnboardingLedgerConnected');
          setPublicKeyState(LedgerStatus.LEDGER_CONNECTED);
          setPublicKeys([...pubKeys, { evm: pubKey.toString('hex') }]);
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
      setConfirmedAccountCount(0);
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

  const onLedgerCardClicked = () => {
    if (publicKeyState === LedgerStatus.LEDGER_CONNECTION_FAILED) {
      capture('OnboardingLedgerErrorPageVisited');
      onError();
    }
  };

  const onPathSelected = async (selectedPathSpec: DerivationPath) => {
    resetStates();
    if (selectedPathSpec === DerivationPath.BIP44) {
      setDerivationPath("m/44'/60'/0'");
    }
    setPathSpec(selectedPathSpec);
    if (selectedPathSpec === DerivationPath.BIP44) {
      setTimeout(async () => {
        getXPublicKey();
      }, WAIT_1500_MILLI_FOR_USER);
      return;
    }
    if (selectedPathSpec === DerivationPath.LedgerLive) {
      getDerivationPathValue(selectedPathSpec);
      await getPubKeys(selectedPathSpec);
    }
  };

  // Attempt to automatically connect using Ledger Live as soon as we
  // establish the transport.
  useEffect(() => {
    const retrieveKeys = async (selectedPathSpec: DerivationPath) => {
      setPublicKeyState(LedgerStatus.LEDGER_LOADING);
      if (selectedPathSpec === DerivationPath.LedgerLive) {
        setAddresses([]);
        setConfirmedAccountCount(0);
        await getPubKeys(selectedPathSpec);
      } else if (selectedPathSpec === DerivationPath.BIP44) {
        getXPublicKey();
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
        typography: <Typography align="left" size={12} height="1.5" />,
      }}
    />
  );

  return (
    <VerticalFlex width="100%" align="center">
      <OnboardingStepHeader
        testId="connect-ledger"
        title={t('Connect your Ledger')}
        onBack={onBack}
        onClose={onCancel}
      />
      <Typography align="center" margin="8px 0 32px" size={14} height="17px">
        <Trans
          i18nKey="Please confirm these actions in the <br/><typography>Avalanche App</typography> on your Ledger device"
          components={{ typography: <Typography weight="bold" /> }}
        />
        <StyledTooltip content={Content}>
          <InfoIcon height="12px" color={theme.colors.icon2} />
        </StyledTooltip>
      </Typography>
      <VerticalFlex grow="1">
        <DerivationPathDropdown
          pathSpec={pathSpec}
          setPathSpec={setPathSpec}
          onPathSelected={onPathSelected}
        />
        {derivationPath &&
          !hasPublicKeys &&
          publicKeyState !== LedgerStatus.LEDGER_CONNECTED && (
            <>
              <LedgerConnectCard
                path={derivationPath}
                status={publicKeyState}
                onClick={onLedgerCardClicked}
                onError={onError}
              />
              {publicKeyState !== LedgerStatus.LEDGER_CONNECTION_FAILED && (
                <VerticalFlex>
                  <Typography size={12} margin="6px 0 0">
                    {getConfirmAccountLabel(confirmedAccountCount, t, pathSpec)}
                  </Typography>
                </VerticalFlex>
              )}
            </>
          )}
        {pathSpec &&
          publicKeyState !== LedgerStatus.LEDGER_CONNECTION_FAILED && (
            <DerivedAddresses
              addresses={addresses}
              network={avalancheNetwork}
              hideLoadinSkeleton={pathSpec === DerivationPath.BIP44}
            />
          )}
      </VerticalFlex>
      {publicKeyState === LedgerStatus.LEDGER_CONNECTION_FAILED && (
        <PrimaryButton
          onClick={() => tryPublicKey()}
          width="343px"
          size={ComponentSize.LARGE}
        >
          {t('Retry')}
        </PrimaryButton>
      )}
      {hasPublicKeys && (
        <PrimaryButton
          onClick={() => onNext()}
          width="343px"
          size={ComponentSize.LARGE}
          margin="16px"
        >
          {t('Next')}
        </PrimaryButton>
      )}
      <LedgerWrongVersionOverlay onClose={() => onCancel()} />
    </VerticalFlex>
  );
}
