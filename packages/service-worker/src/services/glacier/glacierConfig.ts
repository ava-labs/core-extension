import { AppName } from '@avalabs/vm-module-types';
import { runtime } from 'webextension-polyfill';

export const HEADERS = {
  'x-application-name': AppName.CORE_EXTENSION,
  'x-application-version': runtime.getManifest().version,
  ...(process.env.GLACIER_API_KEY
    ? { 'x-api-key': process.env.GLACIER_API_KEY }
    : {}),
};
