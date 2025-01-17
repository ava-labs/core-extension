import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { HVMWallet } from './HVMWallet';
import { TransactionPayload, VMABI } from 'hypersdk-client';
const returnedPublickKey = new Uint8Array(1);
const returnedSign = new Uint8Array(2);

jest.mock('@avalabs/core-wallets-sdk', () => ({
  ...jest.requireActual('@avalabs/core-wallets-sdk'),
  getWalletFromMnemonic: jest.fn(() => ({ path: 'path', privateKey: '0xASD' })),
}));
jest.mock('@noble/curves/ed25519', () => ({
  ed25519: {
    getPublicKey: jest.fn(() => returnedPublickKey),
    sign: jest.fn(() => returnedSign),
  },
}));
jest.mock('hypersdk-client/dist/Marshaler', () => ({
  Marshaler: jest.fn(() => ({
    encodeTransaction: jest.fn(() => 'asd'),
  })),
}));
describe('HVMWallet', () => {
  it('should return the wallet from mnemonic', () => {
    const wallet = HVMWallet.fromMnemonic('mnemonic', 0, DerivationPath.BIP44);
    expect(wallet).toBeInstanceOf(HVMWallet);
  });
  it('should get the public key', () => {
    const wallet = HVMWallet.fromMnemonic('mnemonic', 0, DerivationPath.BIP44);
    const pubKey = wallet.getPublicKey();
    expect(JSON.stringify(pubKey)).toBe(JSON.stringify(returnedPublickKey));
  });
  it('should get the sign with `signEd25519`', async () => {
    const wallet = HVMWallet.fromMnemonic('mnemonic', 0, DerivationPath.BIP44);
    const sign = await wallet.signEd25519(
      {} as TransactionPayload,
      {} as VMABI,
    );
    expect(sign).toBe('1111111');
  });
});
