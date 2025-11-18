import { utils } from '@avalabs/avalanchejs';
import { ChainId, Network, NetworkVMType } from '@avalabs/core-chains-sdk';
import { strip0x } from '@avalabs/core-utils-sdk';
import {
  Avalanche,
  BitcoinProvider,
  getEvmAddressFromPubKey,
  createPsbt,
  deserializeTransactionMessage,
  serializeSolanaTx,
  compileSolanaTx,
} from '@avalabs/core-wallets-sdk';
import * as cs from '@cubist-labs/cubesigner-sdk';
import { Signer } from '@cubist-labs/cubesigner-sdk-ethers-v6';
import { networks } from 'bitcoinjs-lib';
import { JsonRpcProvider, getBytes } from 'ethers';

import { NetworkService } from '../network/NetworkService';

import {
  validKeySet,
  avaKey,
  evmKey,
  avaTestKey,
  anotherValidKeySet,
  invalidKeySet,
  anotherValidEvmKey,
  anotherValidAvaKey,
  validKeySetWithTwoAccounts,
  avaKey2,
  evmKey2,
  btcKey,
  solanaKey,
  solanaKey2,
  anotherValidSolanaKey,
} from './fixtures/rawKeys';
import { SeedlessTokenStorage } from './SeedlessTokenStorage';
import { SeedlessWallet } from './SeedlessWallet';
import { MessageType, MfaRequestType } from '@core/types';
import {
  SignTypedDataVersion,
  TypedDataUtils,
  typedSignatureHash,
} from '@metamask/eth-sig-util';
import { SeedlessBtcSigner } from './SeedlessBtcSigner';
import { SeedlessSessionManager } from './SeedlessSessionManager';
import { SeedlessMfaService } from './SeedlessMfaService';
import { base64, hex } from '@scure/base';
import { getProviderForNetwork } from '@core/common';
import { AddressPublicKey } from '../secrets/AddressPublicKey';

jest.mock('@cubist-labs/cubesigner-sdk');
jest.mock('@cubist-labs/cubesigner-sdk-ethers-v6');
jest.mock('@avalabs/core-wallets-sdk');
jest.mock('../network/NetworkService');
jest.mock('./SeedlessBtcSigner');
jest.mock('./SeedlessMfaService');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  getProviderForNetwork: jest.fn(),
}));
jest.mock('@scure/base');

describe('src/background/services/seedless/SeedlessWallet', () => {
  const sessionStorage = jest.mocked<SeedlessTokenStorage>(
    new SeedlessTokenStorage({} as any),
  );
  const networkService = jest.mocked<NetworkService>(
    new NetworkService({} as any, {} as any, {} as any),
  );
  const sessionManager = jest.mocked<SeedlessSessionManager>({
    notifyTokenExpired: jest.fn(),
  } as any);
  const mfaService = jest.mocked<SeedlessMfaService>({
    requestMfa: jest.fn(),
    askForMfaMethod: jest.fn(),
    emitMfaError: jest.fn(),
    approveWithMfa: jest.fn(),
  } as any);

  let wallet: SeedlessWallet;

  const itCorrectlyHandlesExpiredSession = ({
    additionalSetup,
    executeSigning,
  }: {
    additionalSetup?: (error: Error) => void;
    executeSigning: () => Promise<unknown>;
  }) => {
    describe('when session has expired', () => {
      beforeEach(() => {
        const error = new Error('Session expired for User#1234-ABCD');
        // eslint-disable-next-line
        // @ts-expect-error
        error.status = 403; // CubeSinger throws a regular Error with additional props

        additionalSetup?.(error);
      });

      it('notifies of expired token', async () => {
        try {
          await executeSigning();
        } catch {
          expect(sessionManager.notifyTokenExpired).toHaveBeenCalled();
        }
      });

      it('modifies error message to prevent leaking sensitive data', async () => {
        await expect(executeSigning()).rejects.toThrow('Session has expired');
      });
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('when session cannot be established', () => {
    const connectionError = new Error('Connection failed');

    beforeEach(() => {
      jest
        .mocked(cs.SignerSession.loadSignerSession)
        .mockRejectedValue(connectionError);

      wallet = new SeedlessWallet({ networkService, sessionStorage });
    });

    it('fails the requests', async () => {
      await expect(wallet.getPublicKeys()).rejects.toThrow(connectionError);
    });
  });

  describe('.getPublicKeys()', () => {
    describe('when accounts are not created yet', () => {
      beforeEach(() => {
        jest.mocked(cs.SignerSession.loadSignerSession).mockResolvedValueOnce({
          keys: jest.fn().mockResolvedValue([]),
        } as any);

        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('raises an error', async () => {
        await expect(wallet.getPublicKeys()).rejects.toThrow(
          'Accounts not created',
        );
      });
    });

    describe('when ETH or Avalanche key is not returned', () => {
      beforeEach(() => {
        jest.mocked(cs.SignerSession.loadSignerSession).mockResolvedValueOnce({
          keys: jest.fn().mockResolvedValue([evmKey]),
        } as any);

        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('raises an error', async () => {
        await expect(wallet.getPublicKeys()).rejects.toThrow(
          'Accounts keys missing',
        );
      });
    });

    describe('when required keys are returned', () => {
      beforeEach(() => {
        jest.mocked(cs.SignerSession.loadSignerSession).mockResolvedValueOnce({
          keys: jest.fn().mockResolvedValue(validKeySet),
        } as any);

        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('correctly extracts the public keys', async () => {
        expect(await wallet.getPublicKeys()).toEqual([
          AddressPublicKey.fromJSON({
            key: strip0x(evmKey.publicKey),
            derivationPath: evmKey.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(avaKey.publicKey),
            derivationPath: avaKey.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(solanaKey.publicKey),
            derivationPath: solanaKey.derivation_info.derivation_path,
            curve: 'ed25519',
          }).toJSON(),
        ]);
      });
    });

    describe('when a key set contains keys for multiple accounts', () => {
      beforeEach(() => {
        jest.mocked(cs.SignerSession.loadSignerSession).mockResolvedValueOnce({
          keys: jest.fn().mockResolvedValue(validKeySetWithTwoAccounts),
        } as any);

        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it(`sorts them by derivation path's account index`, async () => {
        expect(await wallet.getPublicKeys()).toEqual([
          AddressPublicKey.fromJSON({
            key: strip0x(evmKey.publicKey),
            derivationPath: evmKey.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(avaKey.publicKey),
            derivationPath: avaKey.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(solanaKey.publicKey),
            derivationPath: solanaKey.derivation_info.derivation_path,
            curve: 'ed25519',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(evmKey2.publicKey),
            derivationPath: evmKey2.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(avaKey2.publicKey),
            derivationPath: avaKey2.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(solanaKey2.publicKey),
            derivationPath: solanaKey2.derivation_info.derivation_path,
            curve: 'ed25519',
          }).toJSON(),
        ]);
      });
    });

    describe('when multiple key sets are returned', () => {
      beforeEach(() => {
        jest.mocked(cs.SignerSession.loadSignerSession).mockResolvedValueOnce({
          keys: jest
            .fn()
            .mockResolvedValue([
              ...anotherValidKeySet,
              ...invalidKeySet,
              ...validKeySet,
            ]),
        } as any);

        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('extracts the public keys from the first valid set', async () => {
        expect(await wallet.getPublicKeys()).toEqual([
          AddressPublicKey.fromJSON({
            key: strip0x(anotherValidEvmKey.publicKey),
            derivationPath: anotherValidEvmKey.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(anotherValidAvaKey.publicKey),
            derivationPath: anotherValidAvaKey.derivation_info.derivation_path,
            curve: 'secp256k1',
          }).toJSON(),
          AddressPublicKey.fromJSON({
            key: strip0x(anotherValidSolanaKey.publicKey),
            derivationPath:
              anotherValidSolanaKey.derivation_info.derivation_path,
            curve: 'ed25519',
          }).toJSON(),
        ]);
      });
    });
  });

  describe('signSolanaTx', () => {
    const signature = '0xA1B2C3D4';
    const mockBase64Tx = 'mockBase64Transaction';
    const mockMessageBytes = new Uint8Array([1, 2, 3]);
    const mockSignatures = {
      [solanaKey.material_id]: null,
    };
    const mockProvider = {} as any;
    let session: jest.Mocked<cs.SignerSession>;

    beforeEach(() => {
      // Mock deserializeTransactionMessage
      (compileSolanaTx as jest.Mock).mockReturnValue({
        signatures: mockSignatures,
        messageBytes: mockMessageBytes,
      });

      // Mock serializeSolanaTx
      (serializeSolanaTx as jest.Mock).mockReturnValue('serializedTx');

      // Mock base64 and hex utilities
      jest.spyOn(base64, 'encode').mockReturnValue('encodedMessage');
      jest.spyOn(hex, 'decode').mockReturnValue(new Uint8Array([4, 5, 6]));

      session = {
        keys: jest.fn().mockResolvedValue(validKeySet),
        signSolana: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue({ signature }),
        }),
      } as any;
      jest
        .mocked(cs.SignerSession.loadSignerSession)
        .mockResolvedValue(session);

      wallet = new SeedlessWallet({
        networkService,
        sessionStorage,
        addressPublicKeys: [
          {
            key: strip0x(solanaKey.publicKey),
          } as any,
        ],
      });
    });

    it('should successfully sign a Solana transaction', async () => {
      const result = await wallet.signSolanaTx(mockBase64Tx, mockProvider);

      expect(deserializeTransactionMessage).toHaveBeenCalledWith(
        mockBase64Tx,
        mockProvider,
      );
      expect(session.signSolana).toHaveBeenCalledWith(solanaKey.material_id, {
        message_base64: 'encodedMessage',
      });
      expect(serializeSolanaTx).toHaveBeenCalledWith({
        messageBytes: mockMessageBytes,
        signatures: {
          [solanaKey.material_id]: new Uint8Array([4, 5, 6]),
        },
      });
      expect(result).toBe('serializedTx');
    });

    it('returns the original transaction if signature is not required', async () => {
      // Mock signatures with existing signature
      (compileSolanaTx as jest.Mock).mockReturnValue({
        signatures: {
          [solanaKey.material_id]: new Uint8Array([1, 2, 3]),
        },
        messageBytes: mockMessageBytes,
      });

      const result = await wallet.signSolanaTx(mockBase64Tx, mockProvider);

      expect(session.signSolana).not.toHaveBeenCalled();
      expect(result).toBe(mockBase64Tx);
    });

    it('throws error if public key is not available', async () => {
      // Create wallet without addressPublicKey
      wallet = new SeedlessWallet({
        sessionStorage: {},
      } as any);

      await expect(
        wallet.signSolanaTx(mockBase64Tx, mockProvider),
      ).rejects.toThrow('Public key not available');
    });
  });

  describe('.signTransaction()', () => {
    beforeEach(() => {
      jest.mocked(cs.SignerSession.loadSignerSession).mockResolvedValueOnce({
        keys: jest.fn().mockResolvedValue(validKeySet),
      } as any);
    });

    describe('when public key is not provided', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('raises an error', async () => {
        await expect(wallet.signTransaction({} as any)).rejects.toThrow(
          'Public key not available',
        );
      });
    });

    describe('when target network is not provided', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: 'la la la',
            } as any,
          ],
        });
      });

      it('raises an error', async () => {
        await expect(wallet.signTransaction({} as any)).rejects.toThrow(
          'Unknown network',
        );
      });
    });

    describe('when incompatible provider is obtained for provided network', () => {
      beforeEach(() => {
        jest.mocked(getProviderForNetwork).mockReturnValue({} as any);
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: 'la la la',
            } as any,
          ],
          network: {} as any,
        });
      });

      it('raises an error', async () => {
        await expect(wallet.signTransaction({} as any)).rejects.toThrow(
          'Wrong provider obtained for EVM transaction',
        );
      });
    });

    describe('when all required data is provided', () => {
      const expectedResult = '0xSignedTx';
      let signer;
      let signerConstructorSpy;

      beforeEach(() => {
        jest
          .mocked(getProviderForNetwork)
          .mockReturnValue(new JsonRpcProvider() as any);

        signer = {
          signTransaction: jest.fn().mockReturnValue(expectedResult),
        };
        signerConstructorSpy = jest.fn().mockReturnValueOnce(signer);
        jest.mocked(Signer).mockImplementation(signerConstructorSpy);

        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: 'la la la',
            } as any,
          ],
          network: { vmName: NetworkVMType.EVM } as any,
          sessionManager,
        });
      });

      itCorrectlyHandlesExpiredSession({
        additionalSetup: (sessionExpiredError) => {
          jest
            .spyOn(signer, 'signTransaction')
            .mockRejectedValue(sessionExpiredError);
        },
        executeSigning: () => wallet.signTransaction({} as any),
      });

      it(`constructs the Signer class`, async () => {
        await wallet.signTransaction({} as any);

        expect(signerConstructorSpy).toHaveBeenCalledWith(
          getEvmAddressFromPubKey(Buffer.from(evmKey.publicKey, 'hex')),
          expect.anything(),
          expect.anything(),
        );
      });

      it(`uses obtained signer to sign the transaction`, async () => {
        const tx = {} as any;
        const result = await wallet.signTransaction(tx);

        expect(signer.signTransaction).toHaveBeenCalledWith(tx);
        expect(result).toEqual(expectedResult);
      });

      describe('when signing fails', () => {
        beforeEach(() => {
          signer = {
            signTransaction: jest
              .fn()
              .mockRejectedValue(new Error('Some API error')),
          };
          signerConstructorSpy = jest.fn().mockReturnValueOnce(signer);
          jest.mocked(Signer).mockImplementation(signerConstructorSpy);
        });

        it('raises an error', async () => {
          await expect(wallet.signTransaction({} as any)).rejects.toThrow(
            new Error('Some API error'),
          );
        });
      });
    });
  });

  describe('.signAvalancheTx()', () => {
    const signature = '0xA1B2C3D4';
    let session: jest.Mocked<cs.SignerSession>;

    beforeEach(() => {
      session = {
        keys: jest.fn().mockResolvedValue([...validKeySet, avaKey2]),
        signBlob: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue({ signature }),
        }),
      } as any;
      jest
        .mocked(cs.SignerSession.loadSignerSession)
        .mockResolvedValue(session);
    });

    describe('when no public key is provided', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('raises an error', async () => {
        await expect(wallet.signAvalancheTx({} as any)).rejects.toThrow(
          'Public keys not available',
        );
      });
    });

    describe('for EVM transactions', () => {
      const txRequest = {
        tx: {
          toBytes() {
            return new Uint8Array([0, 1, 2, 3, 4]);
          },
          getVM() {
            return 'EVM';
          },
          addSignature: jest.fn(),
        },
      };

      beforeEach(() => {
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: strip0x(evmKey.publicKey),
            } as any,
          ],
          network: {} as any,
          sessionManager,
        });
      });

      itCorrectlyHandlesExpiredSession({
        additionalSetup: (sessionExpiredError) => {
          jest
            .spyOn(session, 'signBlob')
            .mockRejectedValue(sessionExpiredError);
        },
        executeSigning: () => wallet.signAvalancheTx(txRequest as any),
      });

      it('uses the EVM public key', async () => {
        await wallet.signAvalancheTx(txRequest as any);

        expect(session.signBlob).toHaveBeenCalledWith(
          evmKey.key_id,
          expect.anything(),
        );
      });

      it('calls signBlob() method with proper payload', async () => {
        await wallet.signAvalancheTx(txRequest as any);

        expect(session.signBlob).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            message_base64: 'CLteXW6qwQSe3giT0w7QIrGk2bW0jbQUhx9Rycs1KD0=',
          }),
        );
      });

      it('adds obtained signature', async () => {
        await wallet.signAvalancheTx(txRequest as any);

        expect(txRequest.tx.addSignature).toHaveBeenCalledWith(
          utils.hexToBuffer(signature),
        );
      });

      it('returns the signed transaction', async () => {
        expect(await wallet.signAvalancheTx(txRequest as any)).toEqual(
          txRequest.tx,
        );
      });
    });

    describe('when signing X/P transaction', () => {
      const txRequest = {
        tx: {
          toBytes() {
            return new Uint8Array([0, 1, 2, 3, 4]);
          },
          getVM() {
            return 'PVM';
          },
          addSignature: jest.fn(),
        },
      };

      beforeEach(() => {
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: strip0x(avaKey.publicKey),
            } as any,
          ],
          network: {} as any,
          sessionManager,
        });
      });

      itCorrectlyHandlesExpiredSession({
        additionalSetup: (sessionExpiredError) => {
          jest
            .spyOn(session, 'signBlob')
            .mockRejectedValue(sessionExpiredError);
        },
        executeSigning: () => wallet.signAvalancheTx(txRequest as any),
      });

      describe('in testnet mode', () => {
        beforeEach(() => {
          networkService.isMainnet.mockReturnValue(false);
        });
        it('uses the testnet Avalanche keys', async () => {
          await wallet.signAvalancheTx(txRequest as any);

          expect(session.signBlob).toHaveBeenCalledWith(
            avaTestKey.key_id,
            expect.anything(),
          );
        });
      });

      describe('in mainnet mode', () => {
        beforeEach(() => {
          networkService.isMainnet.mockReturnValue(true);
        });
        it('uses the mainnet Avalanche keys', async () => {
          await wallet.signAvalancheTx(txRequest as any);

          expect(session.signBlob).toHaveBeenCalledWith(
            avaKey.key_id,
            expect.anything(),
          );
        });
      });

      it('calls signBlob() method for each requested signing key', async () => {
        networkService.isMainnet.mockReturnValue(true);
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            { key: strip0x(avaKey.publicKey) } as any,
            { key: strip0x(avaKey2.publicKey) } as any,
          ],
        });

        await wallet.signAvalancheTx({
          ...txRequest,
          externalIndices: [0, 1],
        } as any);

        expect(session.signBlob).toHaveBeenCalledTimes(2);
        expect(session.signBlob).toHaveBeenNthCalledWith(
          1,
          avaKey.key_id,
          expect.anything(),
        );
        expect(session.signBlob).toHaveBeenNthCalledWith(
          2,
          avaKey2.key_id,
          expect.anything(),
        );
      });

      it('calls signBlob() method with proper payload', async () => {
        await wallet.signAvalancheTx(txRequest as any);

        expect(session.signBlob).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            message_base64: 'CLteXW6qwQSe3giT0w7QIrGk2bW0jbQUhx9Rycs1KD0=',
          }),
        );
      });

      it('adds obtained signature', async () => {
        await wallet.signAvalancheTx(txRequest as any);

        expect(txRequest.tx.addSignature).toHaveBeenCalledWith(
          utils.hexToBuffer(signature),
        );
      });

      it('returns the signed transaction', async () => {
        expect(await wallet.signAvalancheTx(txRequest as any)).toEqual(
          txRequest.tx,
        );
      });
    });
  });

  describe('.signMessage()', () => {
    const signature = '0xA1B2C3D4';
    let session: jest.Mocked<cs.SignerSession>;

    const getMessage = (payload = {}) =>
      ({
        from: '',
        data: {},
        ...payload,
      }) as any;

    beforeEach(() => {
      session = {
        keys: jest.fn().mockResolvedValue(validKeySet),
        signBlob: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue({ signature }),
        }),
        signEip191: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue({ signature }),
        }),
      } as any;
      jest
        .mocked(cs.SignerSession.loadSignerSession)
        .mockResolvedValue(session);
    });

    describe('when public key is not provided', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('raises an error', async () => {
        await expect(
          wallet.signMessage(MessageType.ETH_SIGN, getMessage()),
        ).rejects.toThrow('Public key not available');
      });
    });

    describe('with EVM messages', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: strip0x(evmKey.publicKey),
            } as any,
          ],
          network: {} as any,
          sessionManager,
        });

        jest.mocked(getEvmAddressFromPubKey).mockReturnValue(evmKey.materialId);
      });

      const base64encode = (payload) =>
        Buffer.from(getBytes(payload)).toString('base64');

      const typedDataV1Msg = getMessage({
        data: [{ name: 'Foo', type: 'bool', value: true }],
      });
      const typedDataV3Msg = getMessage({
        data: {
          primaryType: 'Mail',
          types: {
            EIP712Domain: [],
            Mail: [{ name: 'name', type: 'string' }],
          },
          message: { name: 'asdasd' },
          domain: {
            name: 'test site',
            chainId: 1,
          },
        },
      });

      itCorrectlyHandlesExpiredSession({
        additionalSetup: (sessionExpiredError) => {
          jest
            .spyOn(session, 'signBlob')
            .mockRejectedValue(sessionExpiredError);
        },
        executeSigning: () =>
          wallet.signMessage(MessageType.SIGN_TYPED_DATA, typedDataV1Msg),
      });

      it.each([
        {
          type: MessageType.SIGN_TYPED_DATA,
          msg: typedDataV1Msg,
          payload: base64encode(typedSignatureHash(typedDataV1Msg.data)),
        },
        {
          type: MessageType.SIGN_TYPED_DATA_V1,
          msg: typedDataV1Msg,
          payload: base64encode(typedSignatureHash(typedDataV1Msg.data)),
        },
        {
          type: MessageType.SIGN_TYPED_DATA_V3,
          msg: typedDataV3Msg,
          payload: base64encode(
            Uint8Array.from(
              TypedDataUtils.eip712Hash(
                typedDataV3Msg.data,
                SignTypedDataVersion.V3,
              ),
            ),
          ),
        },
        {
          type: MessageType.SIGN_TYPED_DATA_V4,
          msg: typedDataV3Msg,
          payload: base64encode(
            Uint8Array.from(
              TypedDataUtils.eip712Hash(
                typedDataV3Msg.data,
                SignTypedDataVersion.V4,
              ),
            ),
          ),
        },
      ])(
        'calls .signBlob() with proper payload for $type',
        async ({ type, msg, payload }) => {
          await wallet.signMessage(type, msg);

          expect(session.signBlob).toHaveBeenCalledWith(evmKey.key_id, {
            message_base64: payload,
          });
        },
      );

      it('raises an error for unknown message types', async () => {
        await expect(
          wallet.signMessage('Some unknown type' as MessageType, {} as any),
        ).rejects.toThrow('Unknown message type');
      });
    });

    describe('with ETH_SIGN or PERSONAL_SIGN messages', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: strip0x(evmKey.publicKey),
            } as any,
          ],
          sessionManager,
        });

        jest.mocked(getEvmAddressFromPubKey).mockReturnValue(evmKey.materialId);
      });

      const ethSignMsg = getMessage({ data: '0x4243' });

      itCorrectlyHandlesExpiredSession({
        additionalSetup: (sessionExpiredError) => {
          jest
            .spyOn(session, 'signEip191')
            .mockRejectedValue(sessionExpiredError);
        },
        executeSigning: () =>
          wallet.signMessage(MessageType.ETH_SIGN, ethSignMsg),
      });

      it.each([
        {
          type: MessageType.ETH_SIGN,
          msg: ethSignMsg,
          payload: Uint8Array.from(Buffer.from('4243', 'hex')),
        },
        {
          type: MessageType.PERSONAL_SIGN,
          msg: ethSignMsg,
          payload: Uint8Array.from(Buffer.from('4243', 'hex')),
        },
      ])(
        'calls .signEip191() with proper payload for $type',
        async ({ type, msg }) => {
          await wallet.signMessage(type, msg);

          expect(session.signEip191).toHaveBeenCalledWith(
            evmKey.key_id.slice(4), // removes "Key#" prefix
            {
              data: ethSignMsg.data,
            },
          );
        },
      );

      it('raises an error for unknown message types', async () => {
        await expect(
          wallet.signMessage(
            'Some unknown type' as MessageType.AVALANCHE_SIGN,
            {
              data: '0x',
            },
          ),
        ).rejects.toThrow('Unknown message type');
      });
    });

    describe('with Avalanche messages', () => {
      beforeEach(() => {
        networkService.getAvalanceProviderXP.mockReturnValue({
          getAddress: () => `X-${avaKey.materialId}`,
        } as any);

        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: strip0x(evmKey.publicKey),
            } as any,
          ],
          network: {} as any,
        });
      });

      it('validates presence of X/P public key', async () => {
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: '',
            } as any,
          ],
          network: {} as any,
        });

        await expect(
          wallet.signMessage(MessageType.AVALANCHE_SIGN, getMessage()),
        ).rejects.toThrow('X/P public key not available');
      });

      it('calls signBlob() method with proper payload', async () => {
        const message = 'yaaaaay!';
        const hexMessage = Buffer.from(message, 'utf-8').toString('hex');
        const msg = getMessage({
          data: hexMessage,
        });
        const encodedData = Buffer.from(`AVA-Signed:${message}`, 'utf-8');

        jest.mocked(Avalanche.digestMessage).mockReturnValue(encodedData);

        await wallet.signMessage(MessageType.AVALANCHE_SIGN, msg);

        expect(Avalanche.digestMessage).toHaveBeenCalledWith(message);

        expect(session.signBlob).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            message_base64: encodedData.toString('base64'),
          }),
        );
      });
    });

    it('returns the obtained signature', async () => {
      wallet = new SeedlessWallet({
        networkService,
        sessionStorage,
        addressPublicKeys: [
          {
            key: strip0x(evmKey.publicKey),
          } as any,
        ],
        network: {} as any,
      });

      jest.mocked(getEvmAddressFromPubKey).mockReturnValue(evmKey.materialId);

      session.signEip191.mockResolvedValue({
        data: () => ({
          signature: 'dummy-signature',
        }),
      } as any);

      expect(
        await wallet.signMessage(
          MessageType.ETH_SIGN,
          getMessage({ data: '0x1234' }),
        ),
      ).toEqual('dummy-signature');
    });
  });

  describe('.addAccount()', () => {
    let session: jest.Mocked<cs.SignerSession>;

    beforeEach(() => {
      session = {
        keys: jest.fn().mockResolvedValue(validKeySet),
        proveIdentity: jest.fn(),
      } as any;
      jest
        .mocked(cs.SignerSession.loadSignerSession)
        .mockResolvedValue(session);

      wallet = new SeedlessWallet({
        networkService,
        sessionStorage,
        addressPublicKeys: [
          {
            key: strip0x(evmKey.publicKey),
          } as any,
        ],
      });

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
      });
    });

    it('raises an error for invalid account index', async () => {
      await expect(wallet.addAccount(-1)).rejects.toThrow(
        /Account index must be greater than or equal to 1/,
      );
    });

    describe('when seedless api is unreachable', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Timeout'));
      });

      it('raises an error', async () => {
        await expect(wallet.addAccount(1)).rejects.toThrow(
          /Core Seedless API is unreachable/,
        );
      });
    });

    describe('when the mnemonic id cannot be established', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Timeout'));
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: 'uknown key',
            } as any,
          ],
        });
      });

      it('raises an error', async () => {
        await expect(wallet.addAccount(1)).rejects.toThrow(
          /Cannot establish the mnemonic id/,
        );
      });
    });

    it('calls the seedless api with proper payload', async () => {
      const identityProof = { email: 'test@core.app' };
      const mnemonicId = evmKey.derivation_info.mnemonic_id;
      const accountIndex = 1;

      session.proveIdentity.mockResolvedValue(identityProof as any);
      await wallet.addAccount(accountIndex);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/addAccount$/),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ identityProof, mnemonicId, accountIndex }),
        }),
      );
    });

    describe('when API responds with a non-OK status', () => {
      beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
          ok: false,
        });
      });

      it('raises an error', async () => {
        session.proveIdentity.mockResolvedValue({} as any);
        await expect(wallet.addAccount(1)).rejects.toThrow(
          /addAccount request failed/,
        );
      });
    });
  });

  describe('.signTx()', () => {
    const signature = '0xA1B2C3D4';
    let session: jest.Mocked<cs.SignerSession>;

    const mockPsbt = (overrides = {}) => {
      const psbt: any = {
        signInputAsync: jest.fn(),
        validateSignaturesOfAllInputs: jest.fn(),
        finalizeAllInputs: jest.fn(),
        extractTransaction: jest.fn(),
        ...overrides,
      };

      jest.mocked(createPsbt).mockImplementation((ins, outs) =>
        Object.assign(psbt, {
          txInputs: ins,
          txOutputs: outs,
        }),
      );

      return psbt;
    };

    beforeEach(() => {
      session = {
        keys: jest.fn().mockResolvedValue(validKeySet),
        signBtc: jest.fn().mockResolvedValue({
          data: jest.fn().mockReturnValue({ signature }),
        }),
      } as any;
      jest
        .mocked(cs.SignerSession.loadSignerSession)
        .mockResolvedValue(session);
    });

    describe('when no network is provided', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({ networkService, sessionStorage });
      });

      it('raises an error', async () => {
        await expect(wallet.signTx([], [])).rejects.toThrow(
          'Invalid network: Attempting to sign BTC transaction on non Bitcoin network',
        );
      });
    });

    describe('when non-Bitcoin network is provided', () => {
      beforeEach(() => {
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          network: {
            chainId: ChainId.ETHEREUM_HOMESTEAD,
          } as Network,
        });
      });

      it('raises an error', async () => {
        await expect(wallet.signTx([], [])).rejects.toThrow(
          'Invalid network: Attempting to sign BTC transaction on non Bitcoin network',
        );
      });
    });

    describe('when incompatible provider is obtained for provided network', () => {
      beforeEach(() => {
        jest.mocked(getProviderForNetwork).mockReturnValue({} as any);
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [
            {
              key: strip0x(evmKey.publicKey),
            } as any,
          ],
          network: { chainId: ChainId.BITCOIN } as any,
        });
      });

      it('raises an error', async () => {
        await expect(wallet.signTx([], [])).rejects.toThrow(
          'Wrong provider obtained for BTC transaction',
        );
      });
    });

    describe('when public key is not provided', () => {
      beforeEach(() => {
        mockPsbt();
        jest
          .mocked(getProviderForNetwork)
          .mockResolvedValue(new BitcoinProvider());
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          network: {
            chainId: ChainId.BITCOIN,
          } as Network,
        });
      });

      it('raises an error', async () => {
        await expect(wallet.signTx([1] as any, [])).rejects.toThrow(
          'Public key not available',
        );
      });
    });

    describe('when all requirements are met', () => {
      const pubKey = { key: btcKey.publicKey } as any;
      const network: any = {
        chainId: ChainId.BITCOIN,
      };

      beforeEach(() => {
        const bitcoinProvider = new BitcoinProvider();
        jest
          .spyOn(bitcoinProvider, 'getNetwork')
          .mockReturnValue(networks.bitcoin);
        jest.mocked(getProviderForNetwork).mockResolvedValue(bitcoinProvider);
        wallet = new SeedlessWallet({
          networkService,
          sessionStorage,
          addressPublicKeys: [pubKey],
          network,
          sessionManager,
        });
      });

      itCorrectlyHandlesExpiredSession({
        additionalSetup: (sessionExpiredError) => {
          const psbt = mockPsbt();

          jest
            .spyOn(psbt, 'signInputAsync')
            .mockRejectedValueOnce(sessionExpiredError);
        },
        executeSigning: () => wallet.signTx([1] as any, []),
      });

      it('constructs a separate signer for each of tx inputs', async () => {
        const psbt = mockPsbt();
        const inputs = [1, 2, 3];

        await wallet.signTx(inputs as any, []);

        expect(SeedlessBtcSigner).toHaveBeenCalledTimes(inputs.length);

        inputs.forEach((_, i) => {
          expect(SeedlessBtcSigner).toHaveBeenNthCalledWith(
            i + 1,
            pubKey.key,
            psbt,
            i,
            inputs,
            networks.bitcoin,
            session,
          );
        });
      });

      it('uses the constructed signers to sign the transaction inputs', async () => {
        const psbt = mockPsbt();

        const inputs = [1, 2, 3];
        await wallet.signTx(inputs as any, []);

        expect(psbt.signInputAsync).toHaveBeenCalledTimes(inputs.length);
        inputs.forEach((_, i) => {
          expect(psbt.signInputAsync).toHaveBeenNthCalledWith(
            i + 1,
            i,
            expect.any(SeedlessBtcSigner),
          );
        });
      });

      it('validates signatures', async () => {
        const psbt = mockPsbt();

        await wallet.signTx([1] as any, []);

        expect(psbt.validateSignaturesOfAllInputs).toHaveBeenCalled();
      });

      it('finalizes all inputs', async () => {
        const psbt = mockPsbt();

        await wallet.signTx([1] as any, []);

        expect(psbt.finalizeAllInputs).toHaveBeenCalled();
      });

      it('returns the extracted transaction', async () => {
        const pstb = mockPsbt();
        const mockedResult = { nice: 'transaction' };
        pstb.extractTransaction.mockReturnValue(mockedResult);

        expect(await wallet.signTx([1] as any, [])).toEqual(mockedResult);
      });
    });
  });

  describe('phrase export', () => {
    const mnemonicId = `Key#Mnemonic_${evmKey.derivation_info.mnemonic_id}`;
    let session: jest.Mocked<cs.SignerSession>;

    beforeEach(() => {
      session = {
        keys: jest.fn().mockResolvedValue(validKeySet),
        proveIdentity: jest.fn(),
        userExportList: jest.fn(),
        userExportInit: jest.fn(),
        userExportDelete: jest.fn(),
        userExportComplete: jest.fn(),
        fidoApproveStart: jest.fn(),
      } as any;

      mfaService.approveWithMfa.mockResolvedValue({
        data: () => 'data',
      } as any);

      jest
        .mocked(cs.SignerSession.loadSignerSession)
        .mockResolvedValue(session);

      wallet = new SeedlessWallet({
        networkService,
        sessionStorage,
        addressPublicKeys: [
          {
            key: strip0x(evmKey.publicKey),
          } as any,
        ],
        mfaService,
      });
    });

    describe('.getMnemonicExportState()', () => {
      it('returns the pending export', async () => {
        const request = {
          key_id: 'Key#Mnemonic_abcd1234',
          valid_epoch: 123456789,
          exp_epoch: 987654321,
        };

        session.userExportList.mockReturnValueOnce({
          fetchAll: jest.fn().mockResolvedValue([request]),
        } as any);

        expect(await wallet.getMnemonicExportState()).toEqual(request);

        session.userExportList.mockReturnValueOnce({
          fetchAll: jest.fn().mockResolvedValue([]),
        } as any);

        expect(await wallet.getMnemonicExportState()).toEqual(undefined);
      });
    });

    describe('.cancelMnemonicExport()', () => {
      it('calls session.userExportDelete() with proper params', async () => {
        await wallet.cancelMnemonicExport();

        expect(session.userExportDelete).toHaveBeenCalledWith(mnemonicId);
      });

      it('returns undefined', async () => {
        expect(await wallet.cancelMnemonicExport()).toBeUndefined();
      });
    });

    describe('.initMnemonicExport()', () => {
      describe('when no mfa is required', () => {
        const result = {
          key_id: 'Key#Mnemonic_abcd1234',
          valid_epoch: 123456789,
          exp_epoch: 987654321,
        } as any;

        beforeEach(() => {
          session.userExportInit.mockResolvedValue({
            requiresMfa() {
              return false;
            },
            data() {
              return result;
            },
          } as any);
        });

        it('cancels the initiated export & throws an error', async () => {
          await expect(wallet.initMnemonicExport()).rejects.toEqual(
            new Error('Expected MFA to be required'),
          );
          expect(session.userExportDelete).toHaveBeenCalledWith(
            expect.any(String),
          );
        });
      });

      describe('when MFA is required', () => {
        const mfaId = 'mfa-1234';

        const originalRequest = {
          requiresMfa() {
            return true;
          },
          mfaId() {
            return mfaId;
          },
        } as any;

        beforeEach(() => {
          session.userExportInit.mockResolvedValue(originalRequest);
        });

        describe('when user has FIDO device setup', () => {
          beforeEach(() => {
            mfaService.askForMfaMethod.mockResolvedValueOnce({
              type: MfaRequestType.Fido,
            } as any);
          });

          it('prompts a FIDO challenge', async () => {
            await wallet.initMnemonicExport(123);

            expect(mfaService.approveWithMfa).toHaveBeenCalledWith(
              MfaRequestType.Fido,
              originalRequest,
              123,
            );
          });
        });

        describe('when user has TOTP authenticator configured', () => {
          beforeEach(() => {
            mfaService.askForMfaMethod.mockResolvedValueOnce({
              type: MfaRequestType.Totp,
            } as any);
          });

          it('prompts a TOTP challenge', async () => {
            await wallet.initMnemonicExport(123);

            expect(mfaService.approveWithMfa).toHaveBeenCalledWith(
              MfaRequestType.Totp,
              originalRequest,
              123,
            );
          });
        });
      });
    });
  });
});
