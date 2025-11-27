import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  Action,
  buildActionForRequest,
} from '@core/types';
import {
  utils,
  UnsignedTx,
  Credential,
  avaxSerial,
  EVMUnsignedTx,
  VM,
  Utxo,
  evmSerial,
} from '@avalabs/avalanchejs';
import { NetworkService } from '../../network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import getAddressByVM from '../utils/getAddressByVM';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { Network } from '@avalabs/glacier-sdk';
import getProvidedUtxos from '../utils/getProvidedUtxos';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';
import { HEADERS } from '../../glacier/glacierConfig';

type TxParams = {
  transactionHex: string;
  chainAlias: 'X' | 'P' | 'C';
  utxos?: string[];
};

@injectable()
export class AvalancheSignTransactionHandler extends DAppRequestHandler<TxParams> {
  methods = [DAppProviderRequest.AVALANCHE_SIGN_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
  ) {
    super();
  }

  #getUnsignedOrPartiallySignedTx = async ({
    vm,
    txBytes,
    utxos,
    currentAddress,
    currentEvmAddress,
    provider,
  }: {
    txBytes: Uint8Array<ArrayBufferLike>;
    vm: VM;
    utxos: Utxo[];
    currentAddress: string;
    currentEvmAddress: string;
    provider: Avalanche.JsonRpcProvider;
  }) => {
    let credentials: Credential[] | undefined = undefined;
    let parsedTxInstance: UnsignedTx | EVMUnsignedTx;
    const tx = utils.unpackWithManager(vm, txBytes) as avaxSerial.AvaxTx;

    if (evmSerial.isExportTx(tx)) {
      const spenderAddress = tx.ins[0]?.address.toHex();

      if (spenderAddress?.toLowerCase() !== currentEvmAddress.toLowerCase()) {
        throw new Error('This account has nothing to sign');
      }

      return Avalanche.createAvalancheEvmUnsignedTx({
        txBytes,
        vm,
        utxos,
        fromAddress: currentAddress,
      });
    }

    try {
      const codecManager = utils.getManagerForVM(vm);
      const signedTx = codecManager.unpack(txBytes, avaxSerial.SignedTx);

      if (evmSerial.isImportTx(tx)) {
        parsedTxInstance = await Avalanche.createAvalancheEvmUnsignedTx({
          txBytes,
          vm,
          utxos,
          fromAddress: currentAddress,
        });
      } else {
        parsedTxInstance = await Avalanche.createAvalancheUnsignedTx({
          tx,
          provider,
          credentials: signedTx.getCredentials(),
          utxos,
        });
      }

      // transaction has been already (partially) signed, but it may have gaps in its signatures arrays
      // so we fill these gaps with placeholder signatures if needed
      credentials = tx.getSigIndices().map(
        (sigIndices, credentialIndex) =>
          new Credential(
            Avalanche.populateCredential(sigIndices, {
              unsignedTx: parsedTxInstance,
              credentialIndex,
            }),
          ),
      );
    } catch (_err) {
      // transaction hasn't been signed yet thus we continue with a custom list of empty credentials
      // to ensure it contains a signature slot for all signature indices from the inputs
      credentials = tx
        .getSigIndices()
        .map(
          (indicies) => new Credential(Avalanche.populateCredential(indicies)),
        );
    }

    return Avalanche.createAvalancheUnsignedTx({
      tx,
      provider,
      credentials,
      utxos,
    });
  };

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, TxParams>,
  ) => {
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
    const activeAccount = await this.accountsService.getActiveAccount();
    const currentAddress = getAddressByVM(vm, activeAccount);
    const currentEvmAddress = activeAccount?.addressC;
    const network = await this.networkService.getAvalancheNetworkXP();

    if (!currentAddress || !currentEvmAddress) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      };
    }

    const providedUtxos = getProvidedUtxos({
      utxoHexes: providedUtxoHexes,
      vm,
    });
    const utxos = providedUtxos.length
      ? providedUtxos
      : await Avalanche.getUtxosByTxFromGlacier({
          transactionHex,
          chainAlias,
          network: network.isTestnet ? Network.FUJI : Network.MAINNET,
          url: process.env.GLACIER_URL as string,
          token: process.env.GLACIER_API_KEY,
          headers: HEADERS,
        });

    const unsignedOrPartiallySignedTx =
      await this.#getUnsignedOrPartiallySignedTx({
        txBytes,
        vm,
        utxos,
        currentAddress,
        currentEvmAddress,
        provider,
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
      unsignedOrPartiallySignedTx.getSigIndicesForAddress(signerAddress);

    if (!ownSignatureIndices) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'This account has nothing to sign',
        }),
      };
    }

    const sigIndices = unsignedOrPartiallySignedTx.getSigIndices();
    const needsToSign = ownSignatureIndices.some(([inputIndex, sigIndex]) =>
      sigIndices[inputIndex]?.includes(sigIndex),
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
      unsignedOrPartiallySignedTx,
      provider,
      currentAddress,
    );

    if (txData.type === 'unknown') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      };
    }

    const actionData = buildActionForRequest(request, {
      scope,
      displayData: {
        unsignedTxJson: JSON.stringify(unsignedOrPartiallySignedTx.toJSON()),
        txData,
        vm,
        ownSignatureIndices,
      },
    });

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
    frontendTabId?: number,
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
        frontendTabId,
      );

      if (!signedTx) {
        throw new Error(
          `Expected a signedTx to be returned by the wallet, ${typeof signedTx} returned.`,
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
                JSON.stringify([inputIndex, sigIndex]),
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
        },
      );

      // create a new SignedTx with the corrected credentials
      const correctedSignexTx = new avaxSerial.SignedTx(
        signedTransaction.getTx(),
        newDetails.credentials,
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
