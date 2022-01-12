import store from 'store';
import { Subject } from 'rxjs';
/**
 * For every popup window that needs to write and notify the background we will use a
 * storage listener. We are creating one storage listener event, multiplexed out to
 * many callbacks.
 *
 * The issue here is that mobx instances (store and store classes) live across multiple
 * windows. Those stores stay insync through localstorage, but they only sync with local storage
 * when the instance is created. So if a popup writes to localstorage the parent wont be notified
 * nor will the current instance reflect that. So, to be notified we listen for changes to the localstorage
 * and then check if the state we expect for a given event. Once that state is reached we resolve the request
 * and done.
 */
const storageListener = new Subject<StorageEvent>();
globalThis.addEventListener('storage', (evt) => storageListener.next(evt));

/**
 * Not sure why but when you retrieve a store value that was put into localstorage
 * the value returned is double wrapped in qoutes. ex. "\"{value: 1}\"". So when you try
 * and JSON.parse this you still get a string. So for that reason and until we figure out
 * why, I am wrapping this logic to deal with the weirdness so we can fix it in one place later if
 * and when we find a solution
 *
 * @param storeKey the name of the persistedStore
 * @returns the store value
 */
export function getStoreFromStorage(storeKey: string) {
  const transactionsStore = store.get(storeKey) || '{}';
  return JSON.parse(transactionsStore);
}
