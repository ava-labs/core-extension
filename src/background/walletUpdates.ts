import { store } from "@src/store/store";
import { Signal } from "micro-signals";
import { observe } from "mobx";
import { PassThrough } from "stream";
import {
  accountsChangedUpdate,
  unlockStateChangedUpdate,
  chainChangedUpdate,
} from "./utils/providerUpdate";

const signal = new Signal();

observe(store.walletStore, "accounts", (update) => {
  signal.dispatch(accountsChangedUpdate(update.newValue as string[]));
});

observe(store.extensionStore, "isUnlocked", (update) => {
  signal.dispatch(
    unlockStateChangedUpdate(
      update.newValue as boolean,
      store.walletStore.accounts
    )
  );
});

observe(store.walletStore, "addrC", (update) => {
  signal.dispatch(chainChangedUpdate(update.newValue as string));
});

export function createProviderUpdateStream() {
  const stream = new PassThrough({
    objectMode: true,
    destroy() {
      signal.remove(signalListener);
    },
  });

  function signalListener(value) {
    stream.push(value);
  }

  signal.add(signalListener);
  return stream;
}

setInterval(() => {
  signal.dispatch(unlockStateChangedUpdate(true, store.walletStore.accounts));
}, 10000);
