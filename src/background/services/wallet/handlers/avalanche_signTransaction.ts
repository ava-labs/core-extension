import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import {
  utils,
  UnsignedTx,
  Credential,
  avaxSerial,
} from '@avalabs/avalanchejs';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import getAddressByVM from '../utils/getAddressByVM';
import { Avalanche } from '@avalabs/wallets-sdk';
import getProvidedUtxos from '../utils/getProvidedUtxos';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';

type TxParams = {
  transactionHex: string;
  chainAlias: 'X' | 'P';
  utxos?: string[];
};

@injectable()
export class AvalancheSignTransactionHandler extends DAppRequestHandler<TxParams> {
  methods = [DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, TxParams>
  ) => {
    let credentials: Credential[] | undefined = undefined;

    const { request, scope } = rpcCall;
    const {
      transactionHex,
      chainAlias,
      utxos: providedUtxoHexes,
    } = (request.params ?? {}) as TxParams;

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

    const providedUtxos = getProvidedUtxos({
      utxoHexes: providedUtxoHexes,
      vm,
    });
    const utxos = providedUtxos.length
      ? providedUtxos
      : await Avalanche.getUtxosByTxFromGlacier({
          transactionHex,
          chainAlias,
          isTestnet: !this.networkService.isMainnet(),
          url: process.env.GLACIER_URL as string,
          token: process.env.GLACIER_API_KEY,
        });

    try {
      const codecManager = utils.getManagerForVM(vm);
      const signedTx = codecManager.unpack(txBytes, avaxSerial.SignedTx);
      const unsignedTx = await Avalanche.createAvalancheUnsignedTx({
        tx,
        provider,
        credentials: signedTx.getCredentials(),
        utxos,
      });

      // transaction has been already (partially) signed, but it may have gaps in its signatures arrays
      // so we fill these gaps with placeholder signatures if needed
      credentials = tx.getSigIndices().map(
        (sigIndices, credentialIndex) =>
          new Credential(
            Avalanche.populateCredential(sigIndices, {
              unsignedTx,
              credentialIndex,
            })
          )
      );
    } catch (err) {
      // transaction hasn't been signed yet thus we continue with a custom list of empty credentials
      // to ensure it contains a signature slot for all signature indices from the inputs
      credentials = tx
        .getSigIndices()
        .map(
          (indicies) => new Credential(Avalanche.populateCredential(indicies))
        );
    }

    const unsignedTx = await Avalanche.createAvalancheUnsignedTx({
      tx,
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
    const txData = await Avalanche.parseAvalancheTx(
      unsignedTx,
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
      scope,
      displayData: {
        unsignedTxJson: JSON.stringify(unsignedTx.toJSON()),
        txData,
        vm,
        ownSignatureIndices,
      },
    };

    await openApprovalWindow(actionData, `approve/avalancheSignTx`);

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = ({ request }) => {
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
      const { signedTx } = await this.walletService.sign(
        {
          tx: unsignedTx,
        },
        // Must tell it is avalanche network
        this.networkService.getAvalancheNetworkXP(),
        frontendTabId
      );

      if (!signedTx) {
        throw new Error(
          `Expected a signedTx to be returned by the wallet, ${typeof signedTx} returned.`
        );
      }

      const result = JSON.parse(signedTx);

      // With some wallets we already have a fully signed transaction data here,
      // so we can just return here (i.e. WalletConnect + Core Mobile).
      if (result.signedTransactionHex) {
        onSuccess(result);
        return;
      }

      // Otherwise, we need to append the obtained signatures.
      const signedTransaction = UnsignedTx.fromJSON(signedTx);
      const credentials = signedTransaction.getCredentials();

      const newDetails = unsignedTx.getSigIndices().reduce<{
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
                  utils.bufferToHex(Avalanche.emptySignature.toBytes()))
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
        newDetails.credentials
      );

      onSuccess({
        signedTransactionHex: Avalanche.signedTxToHex(correctedSignexTx),
        signatures: newDetails.ownSignatures,
      });
    } catch (e) {
      onError(e);
    }
  };
}
