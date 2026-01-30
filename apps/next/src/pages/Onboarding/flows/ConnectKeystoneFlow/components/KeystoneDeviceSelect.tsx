import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, MenuItem, Select } from '@avalabs/k2-alpine';

import { Section } from '@/pages/Onboarding/components/Section';

import { Device } from '../types';

type KeystoneDeviceSelectProps = {
  device: Device;
  setDevice: (device: Device) => void;
  isKeystoneUsbSupported: boolean;
};

export const KeystoneDeviceSelect = ({
  device,
  setDevice,
  isKeystoneUsbSupported,
}: KeystoneDeviceSelectProps) => {
  const { t } = useTranslation();

  // If the feature flag for USB support is disabled,
  // make sure device is switched back to the QR-based.
  useEffect(() => {
    if (!isKeystoneUsbSupported) {
      setDevice('keystone-qr');
    }
  }, [isKeystoneUsbSupported, setDevice]);

  return (
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
        <MenuItem value="keystone-qr">
          {t('QR code (Supports: Essential, Pro, 3 Pro)')}
        </MenuItem>
        <MenuItem value="keystone-usb" disabled={!isKeystoneUsbSupported}>
          {t('USB (Keystone 3 Pro only)')}
        </MenuItem>
      </Select>
    </Section>
  );
};
