import { AVM } from '@avalabs/avalanchejs-v2';
import { utils } from '@avalabs/avalanchejs-v2';
import { sha256 } from '@noble/hashes/sha256';
import populateCredential, { emptySignature } from './populateCredential';

jest.mock('@avalabs/avalanchejs-v2');
jest.mock('@noble/hashes/sha256');

describe('src/background/services/wallet/utils/populateCredential', () => {
  const unsignedTxMock = {
    getCredentials: jest.fn(),
    getSigIndicesForPubKey: jest.fn(),
    getTx: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws if indices array is empty', () => {
    expect(() => populateCredential([])).toThrowError(
      'Error while adding placeholder signatures for the provided indices.'
    );
  });

  it('returns the correct amount of empty signatures without existing credential', () => {
    const signatures = populateCredential([2, 4]);
    expect(signatures).toStrictEqual(new Array(5).fill(emptySignature));
  });

  it('returns the correct amount of empty signatures with wrong existingCredentialData', () => {
    unsignedTxMock.getCredentials.mockReturnValueOnce([]);

    const signatures = populateCredential([2, 4], {
      unsignedTx: unsignedTxMock,
      credentialIndex: 1,
    });
    expect(signatures).toStrictEqual(new Array(5).fill(emptySignature));
  });

  it('returns the correct amount of empty signatures with existingCredentialData', () => {
    const txMock = { vm: AVM };
    const unsignedTxBytes = new Uint8Array([0, 1, 2]);
    const pubKeyMock = new Uint8Array([3, 4, 5]);
    const credentialMock = [
      {
        toJSON: () => [
          {
            toString: () => emptySignature.toString(),
          },
          {
            toString: () => emptySignature.toString(),
          },
        ],
      },
      {
        toJSON: () => [
          {
            toString: () => emptySignature.toString(),
          },
          {
            toString: () => '0x2',
            toBytes: () => new Uint8Array([6, 7, 8]),
          },
        ],
      },
    ];

    unsignedTxMock.getTx.mockReturnValueOnce(txMock);
    unsignedTxMock.getCredentials.mockReturnValueOnce(credentialMock);
    unsignedTxMock.getSigIndicesForPubKey.mockReturnValueOnce([[1, 4]]);
    (utils.packTx as jest.Mock).mockReturnValueOnce(unsignedTxBytes);
    (utils.recoverPublicKey as jest.Mock).mockReturnValueOnce(pubKeyMock);
    (sha256 as unknown as jest.Mock).mockReturnValueOnce('0x1');

    const signatures = populateCredential([2, 4], {
      unsignedTx: unsignedTxMock,
      credentialIndex: 1,
    });

    // check if correctly replaces signature 4 in credential 1
    const expectedSignatures = new Array(5).fill(emptySignature);
    expectedSignatures[4] = credentialMock[1]?.toJSON()[1];

    expect(JSON.stringify(signatures)).toEqual(
      JSON.stringify(expectedSignatures)
    );
  });
});
