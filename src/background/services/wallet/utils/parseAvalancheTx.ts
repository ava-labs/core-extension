import {
  pvmSerial,
  avmSerial,
  evmSerial,
  TransferableOutput,
  TransferableInput,
  utils,
  VM,
  Context,
} from '@avalabs/avalanchejs-v2';
import { Avalanche } from '@avalabs/wallets-sdk';
import {
  AddDelegatorTx,
  AddValidatorTx,
  AvalancheTx,
  ExportTx,
  ImportTx,
  UnknownTx,
} from '@src/background/services/wallet/models';

function sumOutputs(outs: TransferableOutput[], assetID: string) {
  return outs.reduce((acc, val) => {
    // If asset id does not match, skip
    if (assetID !== val.assetId.value()) {
      return acc;
    }

    return acc + val.amount();
  }, BigInt(0));
}

function sumInputs(outs: TransferableInput[], assetID: string) {
  return outs.reduce((acc, val) => {
    // If asset id does not match, skip
    if (assetID !== val.assetId.value()) {
      return acc;
    }
    return acc + val.amount();
  }, BigInt(0));
}

/**
 * Returns the vm type given a chain id. Support mainnet and Fuji only.
 * @param id ID of the chain
 */
function chainIdToVM(id: string): VM {
  if (
    [
      Avalanche.MainnetContext.xBlockchainID,
      Avalanche.FujiContext.xBlockchainID,
    ].includes(id)
  ) {
    return 'AVM';
  } else if (
    [
      Avalanche.MainnetContext.pBlockchainID,
      Avalanche.FujiContext.pBlockchainID,
    ].includes(id)
  ) {
    return 'PVM';
  } else if (
    [
      Avalanche.MainnetContext.cBlockchainID,
      Avalanche.FujiContext.cBlockchainID,
    ].includes(id)
  ) {
    return 'EVM';
  }

  throw new Error('Unknown chain id. Failed to get alias.');
}

/**
 * Returns human readable data from a given a transaction buffer,
 */
export function parseAvalancheTx(
  txBuff: Buffer | Uint8Array,
  vm: VM,
  context: Context.Context
): AvalancheTx {
  const tx = utils.unpackWithManager(vm, txBuff);

  if (vm === 'PVM') {
    if (pvmSerial.isAddValidatorTx(tx)) {
      // Calculate stake
      const totStake = sumOutputs(tx.stake, context.avaxAssetID);
      return {
        type: 'add_validator',
        chain: vm,
        nodeID: tx.validator.nodeId.value(),
        fee: tx.shares.value(),
        start: tx.validator.startTime.value().toString(),
        end: tx.validator.endTime.value().toString(),
        rewardOwner: tx.rewardsOwner,
        stakeOuts: tx.stake,
        stake: totStake,
      } as AddValidatorTx;
    } else if (pvmSerial.isAddDelegatorTx(tx)) {
      const totStake = sumOutputs(tx.stake, context.avaxAssetID);

      return {
        type: 'add_delegator',
        chain: vm,
        nodeID: tx.validator.nodeId.value(),
        start: tx.validator.startTime.value().toString(),
        end: tx.validator.endTime.value().toString(),
        rewardOwner: tx.rewardsOwner,
        stakeOuts: tx.stake,
        stake: totStake,
      } as AddDelegatorTx;
    } else if (pvmSerial.isImportTx(tx)) {
      const tot = sumInputs(tx.ins, context.avaxAssetID);
      return {
        type: 'import',
        chain: vm,
        source: chainIdToVM(tx.sourceChain.value()),
        amount: tot,
      } as ImportTx;
    } else if (pvmSerial.isExportTx(tx)) {
      const tot = sumOutputs(tx.outs, context.avaxAssetID);
      return {
        type: 'export',
        chain: vm,
        destination: chainIdToVM(tx.destination.value()),
        amount: tot,
      } as ExportTx;
    }
  } else if (vm === 'AVM') {
    if (avmSerial.isImportTx(tx)) {
      const inputs = tx.getInputs();
      const tot = inputs.length
        ? sumInputs(tx.getInputs(), context.avaxAssetID)
        : sumInputs(tx.ins, context.avaxAssetID);
      return {
        type: 'import',
        chain: vm,
        source: chainIdToVM(tx.sourceChain.value()),
        amount: tot,
      } as ImportTx;
    } else if (avmSerial.isExportTx(tx)) {
      const tot = sumOutputs(tx.outs, context.avaxAssetID);
      //TODO: Show change outs? (https://ava-labs.atlassian.net/browse/CP-3819)
      return {
        type: 'export',
        chain: vm,
        destination: chainIdToVM(tx.destination.value()),
        amount: tot,
      } as ExportTx;
    }
    //TODO: Add other tx types including base tx
  } else if (vm === 'EVM') {
    if (evmSerial.isExportTx(tx)) {
      const tot = sumOutputs(tx.exportedOutputs, context.avaxAssetID);
      return {
        type: 'export',
        chain: vm,
        destination: chainIdToVM(tx.destinationChain.value()),
        exportOuts: tx.exportedOutputs,
        amount: tot,
      } as ExportTx;
    } else if (evmSerial.isImportTx(tx)) {
      const tot = sumInputs(tx.importedInputs, context.avaxAssetID);
      return {
        type: 'import',
        chain: vm,
        source: chainIdToVM(tx.sourceChain.value()),
        amount: tot,
      } as ImportTx;
    }
  }

  return {
    type: 'unknown',
    chain: vm,
  } as UnknownTx;
}
