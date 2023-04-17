import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import {
  utils,
  UnsignedTx,
  Credential,
  avaxSerial,
  Utxo,
} from '@avalabs/avalanchejs-v2';
import { parseAvalancheTx } from '@src/background/services/wallet/utils/parseAvalancheTx';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import createAvalancheUnsignedTx from '../utils/createAvalancheUnsignedTx';
import getAddressByVM from '../utils/getAddressByVM';
import { Avalanche } from '@avalabs/wallets-sdk';
import populateCredential, {
  emptySignature,
} from '../utils/populateCredential';

@injectable()
export class AvalancheSignTransactionHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    let credentials: Credential[] | undefined = undefined;
    let utxos: Utxo[] | undefined;

    const { transactionHex, chainAlias } = (request.params ?? {}) as any;

    if (!transactionHex || !chainAlias) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      };
    }

    const vm = Avalanche.getVmByChainAlias(chainAlias);
    const txBytes = utils.hexToBuffer(transactionHex);
    const provider = await this.networkService.getAvalanceProviderXP();
    const currentAddress = getAddressByVM(
      vm,
      this.accountsService.activeAccount
    );

    if (!currentAddress) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      };
    }

    const tx = utils.unpackWithManager(vm, txBytes) as avaxSerial.AvaxTx;

    try {
      const codecManager = utils.getManagerForVM(vm);
      const signedTx = codecManager.unpack(txBytes, avaxSerial.SignedTx);
      const unsignedTx = await createAvalancheUnsignedTx({
        tx,
        vm,
        provider,
        credentials: signedTx.getCredentials(),
      });

      // transaction has been already (partially) signed, but it may have gaps in its signatures arrays
      // so we fill these gaps with placeholder signatures if needed
      credentials = tx
        .getSigIndices()
        .map(
          (sigIndices, credentialIndex) =>
            new Credential(
              populateCredential(sigIndices, { unsignedTx, credentialIndex })
            )
        );

      // prevents double-fetching
      utxos = unsignedTx.getInputUtxos();
    } catch (err) {
      // transaction hasn't been signed yet thus we continue with a custom list of empty credentials
      // to ensure it contains a signature slot for all signature indices from the inputs
      credentials = tx
        .getSigIndices()
        .map((indicies) => new Credential(populateCredential(indicies)));
    }

    const unsignedTx = await createAvalancheUnsignedTx({
      tx,
      vm,
      provider,
      credentials,
      utxos,
    });

    // check if the current account's signature is needed
    const signerAddress = utils.addressesFromBytes([
      utils.parse(currentAddress)[2],
    ])[0];

    if (!signerAddress) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Missing signer address',
        }),
      };
    }

    const ownSignatureIndices =
      unsignedTx.getSigIndicesForAddress(signerAddress);

    if (!ownSignatureIndices) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'This account has nothing to sign',
        }),
      };
    }

    const sigIndices = unsignedTx.getSigIndices();
    const needsToSign = ownSignatureIndices.some(([inputIndex, sigIndex]) =>
      sigIndices[inputIndex]?.includes(sigIndex)
    );

    if (!needsToSign) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'This account has nothing to sign',
        }),
      };
    }

    // get display data for the UI
    const txData = await parseAvalancheTx(
      unsignedTx.getTx(),
      provider,
      currentAddress
    );

    if (txData.type === 'unknown') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      };
    }

    const actionData = {
      ...request,
      tabId: request.site.tabId,
      displayData: {
        unsignedTxJson: JSON.stringify(unsignedTx.toJSON()),
        txData,
        vm,
        ownSignatureIndices,
      },
    };

    await this.openApprovalWindow(
      actionData,
      `approve/avalancheSignTx?id=${request.id}`
    );

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    _,
    onSuccess,
    onError,
    frontendTabId?: number
  ) => {
    try {
      const {
        displayData: { unsignedTxJson, ownSignatureIndices },
      } = pendingAction;

      const unsignedTx = UnsignedTx.fromJSON(unsignedTxJson);
      const signedTransactionJson = await this.walletService.sign(
        {
          tx: unsignedTx,
        },
        frontendTabId,
        // Must tell it is avalanche network
        this.networkService.getAvalancheNetworkXP()
      );

      const signedTransaction = UnsignedTx.fromJSON(signedTransactionJson);
      const credentials = signedTransaction.getCredentials();

      const correctedDetails = unsignedTx.getSigIndices().reduce<{
        credentials: Credential[];
        ownSignatures: { signature: string; sigIndices: [number, number] }[];
      }>(
        (correctedDetails, signatureIndices, inputIndex) => {
          const signatures = signatureIndices.map((sigIndex) => {
            const signature = credentials[inputIndex]?.toJSON()[sigIndex];
            const isOwnSignature = ownSignatureIndices.some(
              (ownIndices) =>
                JSON.stringify(ownIndices) ===
                JSON.stringify([inputIndex, sigIndex])
            );

            if (
              !signature ||
              (isOwnSignature &&
                signature.toString() ===
                  utils.bufferToHex(emptySignature.toBytes()))
            ) {
              throw new Error(`Failed to sign [${inputIndex}, ${sigIndex}]`);
            }

            if (isOwnSignature) {
              correctedDetails.ownSignatures.push({
                signature: signature.toString(),
                sigIndices: [inputIndex, sigIndex],
              });
            }

            return signature;
          });

          correctedDetails.credentials.push(new Credential(signatures));

          return correctedDetails;
        },
        {
          credentials: [],
          ownSignatures: [],
        }
      );

      // create a new SignedTx with the corrected credentials
      const correctedSignexTx = new avaxSerial.SignedTx(
        signedTransaction.getTx(),
        correctedDetails.credentials
      );

      onSuccess({
        signedTransactionHex: Avalanche.signedTxToHex(correctedSignexTx),
        signatures: correctedDetails.ownSignatures,
      });
    } catch (e) {
      onError(e);
    }
  };
}
