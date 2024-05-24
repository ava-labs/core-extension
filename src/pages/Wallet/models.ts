import {
  PChainTransactionType,
  XChainTransactionType,
} from '@avalabs/glacier-sdk';

export enum PchainFilterType {
  ALL = 'All',
  INCOMING = 'Incoming',
  OUTGOING = 'Outgoing',
  ADD_DELEGATOR_TX = 'Add Delegator',
  ADD_SUBNET_VALIDATOR_TX = 'Add Subnet Validator',
  ADD_PERMISSIONLESS_VALIDATOR_TX = 'Add Permissionless Validator',
  ADD_PERMISSIONLESS_DELEGATOR_TX = 'Add Permissionless Delegator',
  ADD_VALIDATOR_TX = 'Add Validator',
  ADVANCE_TIME_TX = 'Advance Time',
  BASE_TX = 'BaseTx',
  CREATE_CHAIN_TX = 'Create Chain',
  CREATE_SUBNET_TX = 'Create Subnet',
  EXPORT_TX = 'Export',
  IMPORT_TX = 'Import',
  REWARD_VALIDATOR_TX = 'Reward Validator',
  REMOVE_SUBNET_VALIDATOR_TX = 'Remove Subnet Validator',
  TRANSFER_SUBNET_OWNERSHIP_TX = 'Transfer Subnet Ownership',
  TRANSFORM_SUBNET_TX = 'Transform Subnet',
}

export const PchainFilterTxTypeMap = {
  [PchainFilterType.ADD_DELEGATOR_TX]: PChainTransactionType.ADD_DELEGATOR_TX,
  [PchainFilterType.ADD_SUBNET_VALIDATOR_TX]:
    PChainTransactionType.ADD_SUBNET_VALIDATOR_TX,
  [PchainFilterType.ADD_PERMISSIONLESS_VALIDATOR_TX]:
    PChainTransactionType.ADD_PERMISSIONLESS_VALIDATOR_TX,
  [PchainFilterType.ADD_PERMISSIONLESS_DELEGATOR_TX]:
    PChainTransactionType.ADD_PERMISSIONLESS_DELEGATOR_TX,
  [PchainFilterType.ADD_VALIDATOR_TX]: PChainTransactionType.ADD_VALIDATOR_TX,
  [PchainFilterType.ADVANCE_TIME_TX]: PChainTransactionType.ADVANCE_TIME_TX,
  [PchainFilterType.BASE_TX]: PChainTransactionType.BASE_TX,
  [PchainFilterType.CREATE_CHAIN_TX]: PChainTransactionType.CREATE_CHAIN_TX,
  [PchainFilterType.CREATE_SUBNET_TX]: PChainTransactionType.CREATE_SUBNET_TX,
  [PchainFilterType.EXPORT_TX]: PChainTransactionType.EXPORT_TX,
  [PchainFilterType.IMPORT_TX]: PChainTransactionType.IMPORT_TX,
  [PchainFilterType.REWARD_VALIDATOR_TX]:
    PChainTransactionType.REWARD_VALIDATOR_TX,
  [PchainFilterType.REMOVE_SUBNET_VALIDATOR_TX]:
    PChainTransactionType.REMOVE_SUBNET_VALIDATOR_TX,
  [PchainFilterType.TRANSFER_SUBNET_OWNERSHIP_TX]:
    PChainTransactionType.TRANSFER_SUBNET_OWNERSHIP_TX,
  [PchainFilterType.TRANSFORM_SUBNET_TX]:
    PChainTransactionType.TRANSFORM_SUBNET_TX,
};

export enum XchainFilterType {
  ALL = 'All',
  INCOMING = 'Incoming',
  OUTGOING = 'Outgoing',
  BASE_TX = 'BaseTx',
  CREATE_ASSET_TX = 'Create Asset',
  OPERATION_TX = 'Operation',
  IMPORT_TX = 'Import',
  EXPORT_TX = 'Export',
}

export const XchainFilterTxTypeMap = {
  [XchainFilterType.BASE_TX]: XChainTransactionType.BASE_TX,
  [XchainFilterType.CREATE_ASSET_TX]: XChainTransactionType.CREATE_ASSET_TX,
  [XchainFilterType.OPERATION_TX]: XChainTransactionType.OPERATION_TX,
  [XchainFilterType.IMPORT_TX]: XChainTransactionType.IMPORT_TX,
  [XchainFilterType.EXPORT_TX]: XChainTransactionType.EXPORT_TX,
};
