import AppAvalanche, { LedgerError } from '@avalabs/hw-app-avalanche';
import type Transport from '@ledgerhq/hw-transport';
import { fromPublicKey } from 'bip32';
import { networks } from 'bitcoinjs-lib';

/**
 * Derives a BIP32 xpub string via the Zondax Avalanche Ledger app (not Ethereum app).
 * Paths must be supported by the app (e.g. `m/44'/60'/N'` for C-Chain, `m/44'/9000'/N'` for X/P).
 */
export async function getAvalancheLedgerExtendedPublicKey(
  transport: Transport,
  path: string,
  showOnDevice = false,
): Promise<string> {
  const app = new AppAvalanche(transport);
  const result = await app.getExtendedPubKey(path, showOnDevice);

  if (result.returnCode !== LedgerError.NoErrors) {
    throw new Error(
      result.errorMessage ||
        'Ledger returned an error while deriving the public key',
    );
  }

  const publicKeyBuffer = Buffer.isBuffer(result.publicKey)
    ? result.publicKey
    : Buffer.from(result.publicKey);
  const chainCodeBuffer = Buffer.isBuffer(result.chain_code)
    ? result.chain_code
    : Buffer.from(result.chain_code);

  return fromPublicKey(publicKeyBuffer, chainCodeBuffer, networks.bitcoin)
    .neutered()
    .toBase58();
}
