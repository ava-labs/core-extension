import {
  AddUserIcon,
  AirdropIcon,
  ArrowDownLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BlockchainIcon,
  ClockIcon,
  HelpCircleIcon,
  MinusCircleIcon,
  ShareIcon,
  Stack,
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
