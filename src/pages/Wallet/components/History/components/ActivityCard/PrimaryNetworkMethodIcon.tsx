import {
  AddUserIcon,
  AirdropIcon,
  ArrowDownLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BlockchainIcon,
  BuildIcon,
  ChevronDoubleUpIcon,
  ClockIcon,
  DownloadIcon,
  HelpCircleIcon,
  MinusCircleIcon,
  RefreshIcon,
  ShareIcon,
  Stack,
  ValidatorIcon,
  useTheme,
} from '@avalabs/core-k2-components';
import { useMemo } from 'react';
import {
  PChainTransactionType,
  XChainTransactionType,
} from '@avalabs/glacier-sdk';
import { TransactionType } from '@avalabs/vm-module-types';
export interface PrimaryNetworkMethodIconProp {
  methodName:
    | TransactionType
    | PChainTransactionType
    | XChainTransactionType
    | 'CreateAssetTx'
    | 'OperationTx';
}

const METHOD_NAME_TO_ICON: Record<
  | PChainTransactionType
  | XChainTransactionType
  | 'CreateAssetTx'
  | 'OperationTx',
  typeof ArrowDownLeftIcon
> = {
  // Both
  ImportTx: ArrowDownLeftIcon,
  ExportTx: ArrowUpRightIcon,
  BaseTx: ArrowRightIcon,
  // X-Chain
  CreateAssetTx: AirdropIcon,
  OperationTx: AirdropIcon,
  // P-Chain
  AddPermissionlessDelegatorTx: AddUserIcon,
  AddValidatorTx: AddUserIcon,
  AddSubnetValidatorTx: AddUserIcon,
  TransferSubnetOwnershipTx: AddUserIcon,
  AddDelegatorTx: AddUserIcon,
  CreateSubnetTx: ShareIcon,
  CreateChainTx: BlockchainIcon,
  TransformSubnetTx: BlockchainIcon,
  AddPermissionlessValidatorTx: AddUserIcon,
  RemoveSubnetValidatorTx: MinusCircleIcon,
  RewardValidatorTx: AirdropIcon,
  AdvanceTimeTx: ClockIcon,
  [PChainTransactionType.CONVERT_SUBNET_TO_L1TX]: RefreshIcon,
  [PChainTransactionType.REGISTER_L1VALIDATOR_TX]: ValidatorIcon,
  [PChainTransactionType.SET_L1VALIDATOR_WEIGHT_TX]: BuildIcon,
  [PChainTransactionType.DISABLE_L1VALIDATOR_TX]: DownloadIcon,
  [PChainTransactionType.INCREASE_L1VALIDATOR_BALANCE_TX]: ChevronDoubleUpIcon,
  UNKNOWN: HelpCircleIcon,
};

export function PrimaryNetworkMethodIcon({
  methodName,
}: PrimaryNetworkMethodIconProp) {
  const theme = useTheme();

  const Icon = useMemo(
    () =>
      methodName
        ? METHOD_NAME_TO_ICON[methodName] || METHOD_NAME_TO_ICON.UNKNOWN
        : METHOD_NAME_TO_ICON.UNKNOWN,
    [methodName]
  );

  return (
    <Stack
      sx={{
        height: theme.spacing(4),
        width: theme.spacing(4),
        borderRadius: '50%',
        backgroundColor: theme.palette.grey[800],
        justifyContent: 'center',
        alignItems: 'center',
        color: 'secondary.main',
      }}
    >
      <Icon />
    </Stack>
  );
}
