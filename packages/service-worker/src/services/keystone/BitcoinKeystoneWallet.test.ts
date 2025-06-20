import * as WalletsSDK from '@avalabs/core-wallets-sdk';
import { CryptoPSBT } from '@keystonehq/bc-ur-registry-eth';
import KeystoneUSBEthSDK from '@keystonehq/hw-app-eth';
import * as hwTransportWebusb from '@keystonehq/hw-transport-webusb';
import { Network, Psbt } from 'bitcoinjs-lib';
import { BitcoinKeystoneWallet } from './BitcoinKeystoneWallet';
import { KeystoneTransport } from '@core/types';

jest.mock('@avalabs/core-wallets-sdk');
jest.mock('@keystonehq/hw-transport-webusb');
jest.mock('@keystonehq/hw-app-eth');

const FIXTURES = {
  MOCKED_PSBT: Buffer.from(
    '70736274ff010052020000000183d71ce248e46fbfae72dc135fd35c66e82a80c0b39d7e21a9e74af19d95429d0000000000ffffffff01e803000000000000160014c626569888f01e91e60143f424b064a259e10da9000000000001011f9c05000000000000160014c626569888f01e91e60143f424b064a259e10da90000',
    'hex',
  ),
  TRANSACTION_REQUEST: {
    inputs: [{}, {}] as WalletsSDK.BitcoinInputUTXO[],
    outputs: [{}] as WalletsSDK.BitcoinOutputUTXO[],
  },
  SIGNATURE_REQUEST: {
    cbor: '587f70736274ff010052020000000183d71ce248e46fbfae72dc135fd35c66e82a80c0b39d7e21a9e74af19d95429d0000000000ffffffff01e803000000000000160014c626569888f01e91e60143f424b064a259e10da9000000000001011f9c05000000000000160014c626569888f01e91e60143f424b064a259e10da90000',
    type: 'crypto-psbt',
  },
  SIGNATURE_RESPONSE: Buffer.from(
    '59012670736274ff010052020000000183d71ce248e46fbfae72dc135fd35c66e82a80c0b39d7e21a9e74af19d95429d0000000000ffffffff01e803000000000000160014c626569888f01e91e60143f424b064a259e10da9000000000001011f9c05000000000000160014c626569888f01e91e60143f424b064a259e10da9220203de2f443b5070e839d6a209ed1afaadfd43daf7bc610a1fefef201a3aca5350ee47304402205a182eabae07ae7ca90af6b33f642002fd84511fc78b1369d01bb74d1779391402203cf4def5984c18d4b2c19976955137141aee17b887940cb53676985fac6cb83d01220603de2f443b5070e839d6a209ed1afaadfd43daf7bc610a1fefef201a3aca5350ee181250b6bc2c0000803c0000800000008000000000000000000000',
    'hex',
  ),
  SIGNED_TX: Buffer.from(
    '70736274ff010052020000000183d71ce248e46fbfae72dc135fd35c66e82a80c0b39d7e21a9e74af19d95429d0000000000ffffffff01e803000000000000160014c626569888f01e91e60143f424b064a259e10da9000000000001011f9c05000000000000160014c626569888f01e91e60143f424b064a259e10da9220203de2f443b5070e839d6a209ed1afaadfd43daf7bc610a1fefef201a3aca5350ee47304402205a182eabae07ae7ca90af6b33f642002fd84511fc78b1369d01bb74d1779391402203cf4def5984c18d4b2c19976955137141aee17b887940cb53676985fac6cb83d01220603de2f443b5070e839d6a209ed1afaadfd43daf7bc610a1fefef201a3aca5350ee181250b6bc2c0000803c0000800000008000000000000000000000',
    'hex',
  ),
  SIGNATURE_REQUEST_UR:
    'UR:CRYPTO-PSBT/HDRKJOJKIDJYZMADAEGMAOAEAEAEADLSTSCEVOFDVEJLRSPLJPUOBWHETEHHIYVSDRLARTQDNTKBCLPTVDGEWNNTMDFWNTAEAEAEAEAEZMZMZMZMADVSAXAEAEAEAEAEAECMAEBBSWDSHFMKLOWTCKMEVAADFXWKDKPFIEOEHKVYBTPTAEAEAEAEAEADADCTNSAHAEAEAEAEAEAECMAEBBSWDSHFMKLOWTCKMEVAADFXWKDKPFIEOEHKVYBTPTCPAMAXUEDLFYFRGDJOVSESTBOEASWECYZSPMZCFXTNYLRFHSBKCTWSWSCXCYFTSGGUGDWYCSBGGDRPRFDWAEAELAFNAEAELAAEAEAELAAEAEAEAEAEAEAEAEAEAEPKTKLELA',
  SIGNATURE_RESPONSE_UR:
    'UR:CRYPTO-PSBT/HKADDSJOJKIDJYZMADAEGMAOAEAEAEADLSTSCEVOFDVEJLRSPLJPUOBWHETEHHIYVSDRLARTQDNTKBCLPTVDGEWNNTMDFWNTAEAEAEAEAEZMZMZMZMADVSAXAEAEAEAEAEAECMAEBBSWDSHFMKLOWTCKMEVAADFXWKDKPFIEOEHKVYBTPTAEAEAEAEAEADADCTNSAHAEAEAEAEAEAECMAEBBSWDSHFMKLOWTCKMEVAADFXWKDKPFIEOEHKVYBTPTCPAOAXUEDLFYFRGDJOVSESTBOEASWECYZSPMZCFXTNYLRFHSBKCTWSWSCXCYFTSGGUGDWYFLDYFYAOCXHTCSDMPYPLATPLKEPTBKYNQDFHIECXAOZCLRGYCTSTLUBWINTICWRLGTCHKKESBBAOCXFNWKUEYKMKGSCSTYPRSENLKOMDGYEMBBCYWYCHROLTMWBNREENKOMKHEPSJZROFSADCPAMAXUEDLFYFRGDJOVSESTBOEASWECYZSPMZCFXTNYLRFHSBKCTWSWSCXCYFTSGGUGDWYCSBGGDRPRFDWAEAELAFNAEAELAAEAEAELAAEAEAEAEAEAEAEAEAEAEIMDYNDDS',
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
  '02457a4e0160c6e5c553436f1f77ec59f09d1a93e1639578657eea995dcb3907b5',
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
        tabId,
      );
    });

    it('builds a partially signed transaction using provided inputs, outputs and network', async () => {
      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;
      await wallet.signTx(inputs, outputs);

      expect(WalletsSDK.createPsbt).toHaveBeenCalledWith(
        inputs,
        outputs,
        network,
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
        tabId,
      );
    });

    it('uses the keystone response to generate a signed transaction', async () => {
      jest
        .spyOn(CryptoPSBT, 'fromCBOR')
        .mockReturnValue({ getPSBT: () => FIXTURES.SIGNED_TX } as CryptoPSBT);

      jest.spyOn(Psbt, 'fromBuffer').mockReturnValue({
        extractTransaction: () => 'signed-tx',
        validateSignaturesOfAllInputs: jest.fn().mockReturnValue(true),
        finalizeAllInputs: jest.fn(),
      } as unknown as Psbt);

      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;
      const result = await wallet.signTx(inputs, outputs);

      expect(CryptoPSBT.fromCBOR).toHaveBeenCalledWith(
        FIXTURES.SIGNATURE_RESPONSE,
      );
      expect(result).toEqual('signed-tx');
    });
  });

  describe('keystone3.signTransaction()', () => {
    let keystone3Wallet: BitcoinKeystoneWallet;

    beforeEach(() => {
      jest
        .spyOn(keystoneTransport, 'requestSignature')
        .mockResolvedValue(FIXTURES.SIGNATURE_RESPONSE);

      jest.spyOn(provider, 'getNetwork').mockReturnValue(network);

      (KeystoneUSBEthSDK as unknown as jest.Mock).mockImplementation(() => {
        return {
          signTransactionFromUr: jest.fn().mockResolvedValue({
            payload: FIXTURES.SIGNATURE_RESPONSE_UR,
          }),
        };
      });

      jest
        .spyOn(hwTransportWebusb, 'createKeystoneTransport')
        .mockResolvedValue({} as any);

      jest.spyOn(WalletsSDK, 'createPsbt').mockReturnValue({
        updateInput: SPIES.updateInput,
        toBuffer: SPIES.toBuffer.mockReturnValue(FIXTURES.MOCKED_PSBT),
      } as unknown as Psbt);

      keystone3Wallet = new BitcoinKeystoneWallet(
        fingerprint,
        pubKey,
        keyPath,
        keystoneTransport,
        provider,
        tabId,
        true,
      );
    });

    it('builds a partially signed transaction using provided inputs, outputs and network', async () => {
      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;

      await keystone3Wallet.signTx(inputs, outputs);

      expect(WalletsSDK.createPsbt).toHaveBeenCalledWith(
        inputs,
        outputs,
        network,
      );
    });

    it('updates all inputs with bip32Derivation info', async () => {
      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;

      await keystone3Wallet.signTx(inputs, outputs);

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

    it('uses the keystone response to generate a signed transaction', async () => {
      jest
        .spyOn(CryptoPSBT, 'fromCBOR')
        .mockReturnValue({ getPSBT: () => FIXTURES.SIGNED_TX } as CryptoPSBT);

      jest.spyOn(Psbt, 'fromBuffer').mockReturnValue({
        extractTransaction: () => 'signed-tx',
        validateSignaturesOfAllInputs: jest.fn().mockReturnValue(true),
        finalizeAllInputs: jest.fn(),
      } as unknown as Psbt);

      const { inputs, outputs } = FIXTURES.TRANSACTION_REQUEST;

      const result = await keystone3Wallet.signTx(inputs, outputs);

      expect(CryptoPSBT.fromCBOR).toHaveBeenCalledWith(
        FIXTURES.SIGNATURE_RESPONSE,
      );
      expect(result).toEqual('signed-tx');
    });
  });
});
