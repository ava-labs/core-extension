import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { PubKeyType } from '../models';

const getDerivationPath = ({
  mnemonic,
  xpub,
  pubKeys,
  seedlessSignerToken,
}: {
  xpub?: string;
  pubKeys?: PubKeyType[];
  mnemonic?: string;
  seedlessSignerToken?: SignerSessionData;
}) => {
  if (mnemonic || xpub || seedlessSignerToken) {
    return DerivationPath.BIP44;
  }

  if (pubKeys?.length) {
    return DerivationPath.LedgerLive;
  }

  throw new Error('Unable to get derivation type for wallet');
};

export default getDerivationPath;
