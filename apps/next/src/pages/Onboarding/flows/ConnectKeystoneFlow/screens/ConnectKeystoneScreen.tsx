import { ChainId } from '@avalabs/core-chains-sdk';
import { useTranslation } from 'react-i18next';
import { FC, useEffect } from 'react';
import { Stack } from '@avalabs/k2-alpine';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import { DerivedAddresses } from '@/pages/Onboarding/components/DerivedAddresses';
import { useAnalyticsContext } from '@core/ui';

import { Device, DerivedKeys, ConnectorCallbacks } from '../types';
import {
  KeystoneSupportButton,
  KeystoneDeviceSelect,
  KeystoneQRInstructions,
  KeystoneUSBConnector,
} from '../components';

type ChooseKeystoneScreenProps = OnboardingScreenProps & {
  onConfirm: () => void;
  minNumberOfKeys: number;
  onScan: () => void;
  device: Device;
  setDevice: (device: Device) => void;
  isKeystoneUsbSupported: boolean;
  derivedInfo?: DerivedKeys;
  usbCallbacks?: ConnectorCallbacks;
  addresses: string[];
};

export const ConnectKeystoneScreen: FC<ChooseKeystoneScreenProps> = ({
  step,
  totalSteps,
  device,
  setDevice,
  onConfirm,
  minNumberOfKeys,
  onScan,
  derivedInfo,
  isKeystoneUsbSupported,
  usbCallbacks,
  addresses,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();
  const { capture } = useAnalyticsContext();

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  useEffect(() => {
    if (derivedInfo?.addressPublicKeys.length) {
      capture('OnboardingKeystoneHasAddresses');
    }
  }, [derivedInfo, capture]);

  const isDiscoveringAddresses =
    device === 'keystone-usb' && addresses.length > 0 && !derivedInfo;

  return (
    <>
      <FullscreenModalTitle>{t('Connect your Keystone')}</FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          'Please choose your device and follow the instructions to connect your Keystone device.',
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent sx={{ alignItems: 'center', gap: 3 }}>
        <KeystoneDeviceSelect
          device={device}
          setDevice={setDevice}
          isKeystoneUsbSupported={isKeystoneUsbSupported}
        />

        {addresses.length > 0 ? (
          <Stack width="100%">
            <DerivedAddresses
              addresses={addresses}
              chainCaipId={AVALANCHE_C_CHAIN_CAIP_ID}
            />
          </Stack>
        ) : (
          <>
            {device === 'keystone-usb' && (
              <KeystoneUSBConnector
                minNumberOfKeys={minNumberOfKeys}
                callbacks={usbCallbacks}
              />
            )}
            {device === 'keystone-qr' && (
              <KeystoneQRInstructions onScan={onScan} />
            )}
          </>
        )}
        <KeystoneSupportButton />
      </FullscreenModalContent>
      <FullscreenModalActions>
        <NavButton
          color="primary"
          loading={isDiscoveringAddresses}
          // For USB devices, "Next" is only active once keys are obtained
          // For QR-code devices, "Next" jumps to the QR-code screen if keys are not obtained yet
          // and confirms keys if they are obtained
          disabled={device === 'keystone-usb' && !derivedInfo}
          onClick={
            device === 'keystone-usb' || derivedInfo ? onConfirm : onScan
          }
        >
          {t('Next')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};

const AVALANCHE_C_CHAIN_CAIP_ID = `eip155:${ChainId.AVALANCHE_MAINNET_ID}`;
