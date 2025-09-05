import { DisplayData } from '@avalabs/vm-module-types';
import { Action } from '@core/types';
import { useNetworkFeeContext } from '@core/ui';

export type UseGaslessArgs = {
  action: Action<DisplayData>;
};

export type UseGaslessReturn = Pick<
  ReturnType<typeof useNetworkFeeContext>,
  | 'fetchAndSolveGaslessChallange'
  | 'gaslessFundTx'
  | 'isGaslessOn'
  | 'setIsGaslessOn'
  | 'fundTxHex'
  | 'setGaslessDefaultValues'
  | 'gaslessPhase'
  | 'setGaslessEligibility'
  | 'isGaslessEligible'
> & {
  tryFunding: (approveCallback: () => void) => Promise<void>;
};

export type UseGasless = (args: UseGaslessArgs) => UseGaslessReturn;

export type GaslessEligibilityParams = [
  chainId: number,
  fromAddress: string | undefined,
  nonce: number | undefined,
];
