import { isEqual } from 'lodash';
import type { Dispatch, SetStateAction } from 'react';

type ExtractTypeFromStateSetter<Type> = Type extends Dispatch<
  SetStateAction<infer T>
>
  ? { StateType: T }
  : never;

/**
 * @param newValue New value being proposed to the state setter
 * @returns A callback to be passed to React's SetState functions.
 * 					It will only update the state if the actual value (not the reference) change.
 * 					Use it to prevent unnecessary re-renders.
 */
export function updateIfDifferent<
  StateSetter extends Dispatch<SetStateAction<any>>
>(
  setStateFn: StateSetter,
  newState: ExtractTypeFromStateSetter<StateSetter>['StateType']
) {
  setStateFn((prevState) => {
    if (newState === prevState) {
      return prevState;
    }

    if (isEqual(prevState, newState)) {
      return prevState;
    }

    return newState;
  });
}
