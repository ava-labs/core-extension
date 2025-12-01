import { KeyInfo } from '@cubist-labs/cubesigner-sdk';

import { ValidPublicKey } from '../types';
import { SUPPORTED_KEY_TYPES } from './constants';

export const isValidPublicKey = (k: KeyInfo): k is ValidPublicKey =>
  k.enabled &&
  k.derivation_info?.derivation_path !== null &&
  SUPPORTED_KEY_TYPES.includes(k.key_type);
