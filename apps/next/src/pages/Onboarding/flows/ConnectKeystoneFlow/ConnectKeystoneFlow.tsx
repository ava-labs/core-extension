import { WalletType } from '@avalabs/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import {
  useAnalyticsContext,
  useFeatureFlagContext,
  useOnboardingContext,
} from '@core/ui';

import {
  ProvideWalletDetailsScreen,
  SelectAvatarScreen,
  EnjoyYourWalletScreen,
} from '../../common-screens';
import { ConnectKeystoneScreen, ConnectKeystoneScreenViaQR } from './screens';
import { Device, DerivedKeys, ConnectorCallbacks } from './types';

const BASE_PATH = '/onboarding/import/keystone';
const TOTAL_STEPS = 6;
const ACCOUNTS_TO_DERIVE = [0, 1, 2];

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

  const isKeystoneUsbSupported = isFlagEnabled('keystone3-onboarding');
  const [device, setDevice] = useState<Device>(
    isKeystoneUsbSupported ? 'keystone-usb' : 'keystone-qr',
  );
  const [derivedKeys, setDerivedKeys] = useState<DerivedKeys>();

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
    }),
    [capture, history],
  );

  const onScan = useCallback(() => {
    history.replace(`${BASE_PATH}/scan-qr`);
  }, [history]);

  const onDeviceChange = useCallback(
    (newDevice: Device) => {
      setDevice(newDevice);

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

  return (
    <Switch>
      <Route exact path={BASE_PATH}>
        <ConnectKeystoneScreen
          step={2}
          totalSteps={TOTAL_STEPS}
          device={device}
          setDevice={onDeviceChange}
          isKeystoneUsbSupported={isKeystoneUsbSupported}
          onConfirm={confirmAddresses}
          onScan={onScan}
          derivedInfo={derivedKeys}
          usbCallbacks={usbConnectorCallbacks}
          accountIndexes={ACCOUNTS_TO_DERIVE}
        />
      </Route>
      <Route path={`${BASE_PATH}/scan-qr`}>
        <ConnectKeystoneScreenViaQR
          step={3}
          totalSteps={TOTAL_STEPS}
          accountIndexes={ACCOUNTS_TO_DERIVE}
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
          step={4}
          totalSteps={TOTAL_STEPS}
          onNext={() => history.push(`${BASE_PATH}/select-avatar`)}
        />
      </Route>
      <Route path={`${BASE_PATH}/select-avatar`}>
        <SelectAvatarScreen
          step={5}
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
