import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import browser from 'webextension-polyfill';

export const shouldUseWebHID = async () => {
  const platformInfo = await browser.runtime.getPlatformInfo();
  const isWebHIDSupported = await TransportWebHID.isSupported();
  return platformInfo.os === 'win' && isWebHIDSupported;
};
