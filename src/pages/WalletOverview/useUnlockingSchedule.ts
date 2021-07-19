import { useMemo } from 'react';
import {
  PlatformVMConstants,
  StakeableLockOut,
  UTXOSet,
} from 'avalanche/dist/apis/platformvm';
export function useUnlockingSchedule(utxoSet: UTXOSet) {
  return useMemo(() => {
    let utxos = utxoSet.getAllUTXOs();
    return (
      utxos
        .filter((utxo) => {
          let typeID = utxo.getOutput().getTypeID();
          return typeID === PlatformVMConstants.STAKEABLELOCKOUTID;
        })

        .map((utxo) => utxo.getOutput() as StakeableLockOut)

        // Order by unlock date, ascending
        .sort((a, b) => {
          let timeA = a.getStakeableLocktime();
          let timeB = b.getStakeableLocktime();

          return timeA.sub(timeB).toNumber();
        })
    );
  }, [utxoSet]);
}
