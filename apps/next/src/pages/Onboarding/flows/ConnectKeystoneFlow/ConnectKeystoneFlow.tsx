import { hex } from '@scure/base';
import { WalletType } from '@avalabs/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';

import {
  useAnalyticsContext,
  useFeatureFlagContext,
  useOnboardingContext,
} from '@core/ui';

import {
  CustomizeCore,
  EnjoyYourWalletScreen,
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
} from '../../common-screens';
import { ConnectKeystoneScreen, ConnectKeystoneScreenViaQR } from './screens';
import { ConnectorCallbacks, DerivedKeys, Device, PublicKey } from './types';
import { FeatureGates } from '@core/types';

const BASE_PATH = '/onboarding/import/keystone';
const TOTAL_STEPS = 7;
const MIN_NUMBER_OF_KEYS = 1;

export const ConnectKeystoneFlow = () => {
  const history = useHistory();
  const {
    addressPublicKeys,
    onboardingState,
    setOnboardingWalletType,
    setExtendedPublicKeys,
    setMasterFingerprint,
    setAddressPublicKeys,
    resetStates,
  } = useOnboardingContext();
  const { capture } = useAnalyticsContext();
  const { isFlagEnabled } = useFeatureFlagContext();

  const isKeystoneUsbSupported = isFlagEnabled(FeatureGates.KEYSTONE_3);
  const [device, setDevice] = useState<Device>(
    isKeystoneUsbSupported ? 'keystone-usb' : 'keystone-qr',
  );
  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>();
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    if (!addressPublicKeys?.length && !onboardingState.isOnBoarded) {
      history.replace(BASE_PATH);
    }
  }, [addressPublicKeys?.length, history, onboardingState.isOnBoarded]);

  useEffect(() => {
    setOnboardingWalletType(WalletType.Keystone);

    return resetStates;
  }, [setOnboardingWalletType, resetStates]);

  const onAvatarSelected = useCallback(() => {
    capture('OnboardingAvatarSelected');
    history.push(`${BASE_PATH}/enjoy-your-wallet`);
  }, [capture, history]);

  const onQRCodeScanned = useCallback(
    (obtainedKeys: DerivedKeys) => {
      capture(`KeystoneScanQRCodeSuccess`);

      setDerivedKeys(obtainedKeys);

      history.replace(BASE_PATH);
    },
    [capture, history],
  );

  const usbConnectorCallbacks: ConnectorCallbacks = useMemo(
    () => ({
      onConnectionSuccess: (obtainedKeys: DerivedKeys) => {
        capture(`OnboardingKeystone3Connected`);
        setDerivedKeys(obtainedKeys);
        history.replace(BASE_PATH);
      },
      onConnectionFailed: () => capture('OnboardingKeystone3ConnectionFailed'),
      onConnectionRetry: () => capture('OnboardingKeystone3Retry'),
      onActivePublicKeysDiscovered: (publicKeys: PublicKey[]) => {
        setAddresses(deriveAddresses(publicKeys));
      },
    }),
    [capture, history],
  );

  const onScan = useCallback(() => {
    history.replace(`${BASE_PATH}/scan-qr`);
  }, [history]);

  const onDeviceChange = useCallback(
    (newDevice: Device) => {
      setDevice(newDevice);
      setAddresses([]);

      // Reset the whole state when device changes
      setDerivedKeys(undefined);
      setExtendedPublicKeys([]);
      setAddressPublicKeys([]);
      setMasterFingerprint('');
    },
    [setAddressPublicKeys, setExtendedPublicKeys, setMasterFingerprint],
  );

  const confirmAddresses = useCallback(() => {
    if (!derivedKeys) {
      return;
    }

    setExtendedPublicKeys(derivedKeys.extendedPublicKeys);
    setAddressPublicKeys(derivedKeys.addressPublicKeys.map(({ key }) => key));
    setMasterFingerprint(derivedKeys.masterFingerprint);

    history.push(`${BASE_PATH}/wallet-details`);
  }, [
    derivedKeys,
    history,
    setAddressPublicKeys,
    setExtendedPublicKeys,
    setMasterFingerprint,
  ]);

  let step = 2;
  return (
    <Switch>
      <Route exact path={BASE_PATH}>
        <ConnectKeystoneScreen
          step={step++}
          totalSteps={TOTAL_STEPS}
          device={device}
          setDevice={onDeviceChange}
          isKeystoneUsbSupported={isKeystoneUsbSupported}
          onConfirm={confirmAddresses}
          onScan={onScan}
          derivedInfo={derivedKeys}
          usbCallbacks={usbConnectorCallbacks}
          minNumberOfKeys={MIN_NUMBER_OF_KEYS}
          addresses={addresses}
        />
      </Route>
      <Route path={`${BASE_PATH}/scan-qr`}>
        <ConnectKeystoneScreenViaQR
          step={step++}
          totalSteps={TOTAL_STEPS}
          minNumberOfKeys={MIN_NUMBER_OF_KEYS}
          onSuccess={onQRCodeScanned}
          onFailure={(isDimensionsError) => {
            if (isDimensionsError) {
              capture('KeystoneScanQRCodeDimensionsError');
            } else {
              capture('KeystoneScanQRCodeError');
            }
          }}
        />
      </Route>
      <Route path={`${BASE_PATH}/wallet-details`}>
        <ProvideWalletDetailsScreen
          step={step++}
          totalSteps={TOTAL_STEPS}
          onNext={() => history.push(`${BASE_PATH}/customize-core`)}
        />
      </Route>
      <Route path={`${BASE_PATH}/customize-core`}>
        <CustomizeCore
          step={step++}
          totalSteps={TOTAL_STEPS}
          onNext={() => history.push(`${BASE_PATH}/select-avatar`)}
        />
      </Route>
      <Route path={`${BASE_PATH}/select-avatar`}>
        <SelectAvatarScreen
          step={step++}
          totalSteps={TOTAL_STEPS}
          onNext={onAvatarSelected}
        />
      </Route>
      <Route path={`${BASE_PATH}/enjoy-your-wallet`}>
        <EnjoyYourWalletScreen />
      </Route>
    </Switch>
  );
};

const deriveAddresses = (keys: PublicKey[]) =>
  keys
    .filter(({ vm }) => vm === 'EVM')
    .map(({ key }) => key.key)
    .map((publicKeyHex) =>
      getEvmAddressFromPubKey(Buffer.from(hex.decode(publicKeyHex))),
    );
