import { hex } from '@scure/base';
import { ChainId } from '@avalabs/core-chains-sdk';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import { getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';
import { ChevronDownIcon, MenuItem, Select, Stack } from '@avalabs/k2-alpine';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import { Section } from '@/pages/Onboarding/components/Section';
import { LoadingScreen } from '@/pages/Onboarding/components/LoadingScreen';
import { DerivedAddresses } from '@/pages/Onboarding/components/DerivedAddresses';

import { Device, PublicKey, QRCodeDerivedKeys } from '../types';
import { KeystoneQRInstructions } from '../components/KeystoneQRConnector/KeystonQRInstructions';

type ChooseKeystoneScreenProps = OnboardingScreenProps & {
  onConfirm: () => void;
  onScan: () => void;
  device: Device;
  setDevice: (device: Device) => void;
  isKeystoneUsbSupported: boolean;
  derivedInfo?: QRCodeDerivedKeys;
};

export const ChooseKeystoneScreen: FC<ChooseKeystoneScreenProps> = ({
  step,
  totalSteps,
  device,
  setDevice,
  onConfirm,
  onScan,
  derivedInfo,
  isKeystoneUsbSupported,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();

  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  useEffect(() => {
    if (derivedInfo) {
      setAddresses(deriveAddresses(derivedInfo.addressPublicKeys));
    }
  }, [derivedInfo]);

  return (
    <>
      <OnboardingStepTitle>{t('Connect your Keystone')}</OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          'Please choose your device and follow the instructions to connect your Keystone device.',
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent sx={{ alignItems: 'center', gap: 3 }}>
        <Section width="100%">
          <Select
            size="medium"
            variant="outlined"
            label={t('Select device')}
            IconComponent={() => <ChevronDownIcon size={20} />}
            value={device}
            onChange={(e) => setDevice(e.target.value as Device)}
            sx={{ py: 0.75 }}
          >
            <MenuItem value="keystone-usb" disabled={!isKeystoneUsbSupported}>
              USB (Keystone 3 Pro)
            </MenuItem>
            <MenuItem value="keystone-qr">
              QR code (Keystone Essential/Pro)
            </MenuItem>
          </Select>
        </Section>
        {addresses.length > 0 ? (
          <Stack width="100%">
            <DerivedAddresses
              addresses={addresses}
              chainCaipId={AVALANCHE_C_CHAIN_CAIP_ID}
            />
          </Stack>
        ) : (
          <>
            {/* TODO: Add USB screen */}
            {device === 'keystone-usb' && <LoadingScreen />}{' '}
            {device === 'keystone-qr' && (
              <KeystoneQRInstructions onScan={onScan} />
            )}
          </>
        )}
      </OnboardingStepContent>
      <OnboardingStepActions>
        <NavButton
          color="primary"
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
      </OnboardingStepActions>
    </>
  );
};

const AVALANCHE_C_CHAIN_CAIP_ID = `eip155:${ChainId.AVALANCHE_MAINNET_ID}`;

const deriveAddresses = (keys: PublicKey[]) =>
  keys
    .map(({ key }) => key.key)
    .map((publicKeyHex) =>
      getEvmAddressFromPubKey(Buffer.from(hex.decode(publicKeyHex))),
    );
