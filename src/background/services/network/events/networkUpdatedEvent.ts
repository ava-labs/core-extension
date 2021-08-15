import { map } from 'rxjs';
import { network } from '../handlers';
import { NetworkEvents } from './models';

export function networkUpdateEvents() {
  return network.pipe(
    map((network) => {
      return {
        name: NetworkEvents.NETWORK_UPDATE_EVENT,
        value: network,
      };
    })
  );
}
