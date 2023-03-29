import * as WalletsSDK from '@avalabs/wallets-sdk';
import { CryptoPSBT } from '@keystonehq/bc-ur-registry-eth';
import { Network, Psbt } from 'bitcoinjs-lib';
import { BitcoinKeystoneWallet } from './BitcoinKeystoneWallet';
import { KeystoneTransport } from './models';

jest.mock('@avalabs/wallets-sdk');

const FIXTURES = {
  MOCKED_PSBT: Buffer.from(
    '70736274ff0100520200000001a571b1112b5ce00487e5d3531f168ace50834675898766f96ad55d19374d28770000000000ffffffff0110270000000000001600142f1687421b7b090e42918332b16f4a81d74c4ad7000000000001011f6d3300000000000016001405bd27f4c353c4dc49af121439b810828bc15ab4220602457a4e0160c6e5c553436f1f77ec59f09d1a93e1639578657eea995dcb3907b51880d3bb222c0000803c0000800000008000000000000000000000',
    'hex'
  ),
  TRANSACTION_REQUEST: {
    inputs: [{}, {}] as WalletsSDK.BitcoinInputUTXO[],
    outputs: [{}] as WalletsSDK.BitcoinOutputUTXO[],
  },
  SIGNATURE_REQUEST: {
    cbor: '58bb70736274ff0100520200000001a571b1112b5ce00487e5d3531f168ace50834675898766f96ad55d19374d28770000000000ffffffff0110270000000000001600142f1687421b7b090e42918332b16f4a81d74c4ad7000000000001011f6d3300000000000016001405bd27f4c353c4dc49af121439b810828bc15ab4220602457a4e0160c6e5c553436f1f77ec59f09d1a93e1639578657eea995dcb3907b51880d3bb222c0000803c0000800000008000000000000000000000',
    type: 'crypto-psbt',
  },
  SIGNATURE_RESPONSE: Buffer.from(
    '58ed70736274ff0100520200000001a571b1112b5ce00487e5d3531f168ace50834675898766f96ad55d19374d28770000000000ffffffff0110270000000000001600142f1687421b7b090e42918332b16f4a81d74c4ad7000000000001011f6d3300000000000016001405bd27f4c353c4dc49af121439b810828bc15ab401086b0247304402206cc7fb01a93e7277f19f71cf1610761ee038db9ea7e91e4b923a8dbc4420f062022043341566f0b122e11e7ed636e8acfab4c4b53312fab10bb4375375ec10344ab5012102457a4e0160c6e5c553436f1f77ec59f09d1a93e1639578657eea995dcb3907b50000',
    'hex'
  ),
  SIGNED_TX: Buffer.from(
    '70736274ff0100520200000001a571b1112b5ce00487e5d3531f168ace50834675898766f96ad55d19374d28770000000000ffffffff0110270000000000001600142f1687421b7b090e42918332b16f4a81d74c4ad7000000000001011f6d3300000000000016001405bd27f4c353c4dc49af121439b810828bc15ab401086b0247304402206cc7fb01a93e7277f19f71cf1610761ee038db9ea7e91e4b923a8dbc4420f062022043341566f0b122e11e7ed636e8acfab4c4b53312fab10bb4375375ec10344ab5012102457a4e0160c6e5c553436f1f77ec59f09d1a93e1639578657eea995dcb3907b50000',
    'hex'
  ),
};

const SPIES = {
  updateInput: jest.fn(),
  toBuffer: jest.fn(),
};

const keystoneTransport = {
  requestSignature: jest.fn(),
} as unknown as KeystoneTransport;
const fingerprint = '80d3bb22';
const pubKey = Buffer.from(
  '02457a4e0160c6e5c553436f1f77ec59f09d1a93e1639578657eea995dcb3907b5'
);
const keyPath = `m/44'/9000'/0'/0/0`;
const network = { bech32: 'tb' } as Network;
const provider = {
  getNetwork: jest.fn(),
} as unknown as WalletsSDK.BitcoinProviderAbstract;
const tabId = 753;

describe('src/background/services/keystone/BitcoinKeystoneWallet.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('.signTransaction()', () => {
    let wallet: BitcoinKeystoneWallet;

    beforeEach(() => {
      jest
        .spyOn(keystoneTransport, 'requestSignature')
        .mockResolvedValue(FIXTURES.SIGNATURE_RESPONSE);

      jest.spyOn(provider, 'getNetwork').mockReturnValue(network);

      jest.spyOn(WalletsSDK, 'createPsbt').mockReturnValue({
        updateInput: SPIES.updateInput,
        toBuffer: SPIES.toBuffer.mockReturnValue(FIXTURES.MOCKED_PSBT),
      } as unknown as Psbt);

      wallet = new BitcoinKeystoneWallet(
        fingerprint,
        pubKey,
        keyPath,
        keystoneTransport,
        provider,
        tabId
      );
    });

    it('builds a partially signed transaction using provided inputs, outputs and network', async () => {
      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;
      await wallet.signTx(inputs, outputs);

      expect(WalletsSDK.createPsbt).toHaveBeenCalledWith(
        inputs,
        outputs,
        network
      );
    });

    it('updates all inputs with bip32Derivation info', async () => {
      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;
      await wallet.signTx(inputs, outputs);

      inputs.forEach((_, index) => {
        expect(SPIES.updateInput).toHaveBeenCalledWith(index, {
          bip32Derivation: [
            {
              masterFingerprint: Buffer.from(fingerprint, 'hex'),
              pubkey: pubKey,
              path: keyPath,
            },
          ],
        });
      });
    });

    it('requests signature from the keystone device', async () => {
      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;
      await wallet.signTx(inputs, outputs);

      expect(keystoneTransport.requestSignature).toHaveBeenCalledWith(
        FIXTURES.SIGNATURE_REQUEST,
        tabId
      );
    });

    it('uses the keystone response to generate a signed transaction', async () => {
      jest
        .spyOn(CryptoPSBT, 'fromCBOR')
        .mockReturnValue({ getPSBT: () => FIXTURES.SIGNED_TX } as CryptoPSBT);

      jest.spyOn(Psbt, 'fromBuffer').mockReturnValue({
        extractTransaction: () => 'signed-tx',
      } as unknown as Psbt);

      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;
      const result = await wallet.signTx(inputs, outputs);

      expect(CryptoPSBT.fromCBOR).toHaveBeenCalledWith(
        FIXTURES.SIGNATURE_RESPONSE
      );
      expect(result).toEqual('signed-tx');
    });
  });
});
