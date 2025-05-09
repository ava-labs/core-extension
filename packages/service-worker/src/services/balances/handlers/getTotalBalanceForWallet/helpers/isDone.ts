import { ADDRESS_GAP_LIMIT } from '../models';

export function isDone(currentGap: number) {
  return currentGap > ADDRESS_GAP_LIMIT;
}
