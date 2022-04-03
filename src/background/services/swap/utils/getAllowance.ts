import { resolve } from '@src/utils/promiseResolver';
import { Allowance } from 'paraswap/build/types';
import { firstValueFrom } from 'rxjs';
import { paraSwap$ } from '../swap';

export async function getAllowance(
  network: string,
  userAddress: string,
  tokenAddress: string
): Promise<Allowance> {
  const [paraSwap] = await resolve(firstValueFrom(paraSwap$));
  const url = `${paraSwap.apiURL}/users/tokens/${network}/${userAddress}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.tokens.find((t) => t.address === tokenAddress)?.allowance;
}
