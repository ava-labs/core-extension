import { useMemo } from 'react';
import {
  PlatformVMConstants,
  StakeableLockOut,
  UTXOSet,
} from 'avalanche/dist/apis/platformvm';
export function useUnlockingSchedule(utxoSet: UTXOSet) {
  return useMemo(() => {
    const utxos = utxoSet.getAllUTXOs();
    return (
      utxos
        .filter((utxo) => {
          const typeID = utxo.getOutput().getTypeID();
          return typeID === PlatformVMConstants.STAKEABLELOCKOUTID;
        })

        .map((utxo) => utxo.getOutput() as StakeableLockOut)

        // Order by unlock date, ascending
        .sort((a, b) => {
          const timeA = a.getStakeableLocktime();
          const timeB = b.getStakeableLocktime();

          return timeA.sub(timeB).toNumber();
        })
    );
  }, [utxoSet]);
}
