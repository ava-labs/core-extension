import { DerivationPath } from '@avalabs/wallets-sdk';
import { PubKeyType } from '../models';

const getDerivationPath = ({
  mnemonic,
  xpub,
  pubKeys,
}: {
  xpub?: string;
  pubKeys?: PubKeyType[];
  mnemonic?: string;
}) => {
  if (mnemonic || xpub) {
    return DerivationPath.BIP44;
  }

  if (pubKeys?.length) {
    return DerivationPath.LedgerLive;
  }

  throw new Error('Unable to get derivation type for wallet');
};

export default getDerivationPath;
