import { ExtensionConnectionMessage } from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { network } from '../network';

export async function getSelectedNetwork(request: ExtensionConnectionMessage) {
  const result = await firstValueFrom(network);

  return {
    ...request,
    result,
  };
}
