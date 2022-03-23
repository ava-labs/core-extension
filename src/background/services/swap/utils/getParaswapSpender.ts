import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom } from 'rxjs';
import { paraSwap$ } from '../swap';

export async function getParaswapSpender(): Promise<string> {
  const [paraSwap] = await resolve(firstValueFrom(paraSwap$));
  const response = await fetch(
    `${paraSwap.apiURL}/adapters/contracts?network=43114`
  );

  const result = await response.json();
  return result.TokenTransferProxy;
}
