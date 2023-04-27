import { Signature, UnsignedTx, utils } from '@avalabs/avalanchejs-v2';
import { sha256 } from '@noble/hashes/sha256';

export const emptySignature = new Signature(new Uint8Array(Array(65).fill(0)));

const populateCredential = (
  indices: number[],
  existingCredentialData?: {
    unsignedTx: UnsignedTx;
    credentialIndex: number;
  }
): Signature[] => {
  const maxSigIndex = Math.max(...indices);

  if (!isFinite(maxSigIndex)) {
    throw new Error(
      'Error while adding placeholder signatures for the provided indices.'
    );
  }

  const emptySignatures = new Array(maxSigIndex + 1).fill(emptySignature);

  if (!existingCredentialData) {
    return emptySignatures;
  }

  const { unsignedTx, credentialIndex } = existingCredentialData;
  const existingCredential = unsignedTx.getCredentials()[credentialIndex];

  if (!existingCredential) {
    return emptySignatures;
  }

  // replace all empty signatures records if we have an existing signature for its index
  const unsignedTxBytes = utils.packTx(unsignedTx.getTx());
  const unsignedTxHash = sha256(unsignedTxBytes);
  const emptySignatureHex = emptySignature.toString();

  for (const existingSig of existingCredential.toJSON()) {
    if (existingSig.toString() === emptySignatureHex) {
      continue;
    }

    const pubKey = utils.recoverPublicKey(
      unsignedTxHash,
      existingSig.toBytes()
    );
    const allSigIndices = unsignedTx.getSigIndicesForPubKey(pubKey) ?? [];

    for (const sigIndices of allSigIndices) {
      if (sigIndices[0] === credentialIndex) {
        emptySignatures[sigIndices[1]] = existingSig;
      }
    }
  }

  return emptySignatures;
};

export default populateCredential;
