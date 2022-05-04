import { container, singleton } from 'tsyringe';
import { OnLock, OnStorageReady, OnUnlock } from './lifecycleCallbacks';

@singleton()
export class CallbackManager {
  private getInstancesForInterface<T>(callbackMethod: keyof T): T[] {
    const instances: T[] = [];
    const entries = (container as any)._registry.entries();
    for (const entry of entries) {
      if (entry[0] === CallbackManager) {
        // prevent infinite loop
        continue;
      }
      for (const v of entry[1]) {
        if (typeof v?.instance?.[callbackMethod] === 'function') {
          instances.push(v.instance);
        }
      }
    }
    return instances;
  }

  onLock() {
    const instances = this.getInstancesForInterface<OnLock>('onLock');
    instances.forEach((i) => i.onLock());
  }

  onUnlock() {
    const instances = this.getInstancesForInterface<OnUnlock>('onUnlock');
    instances.forEach((i) => i.onUnlock());
  }

  onStorageReady() {
    const instances =
      this.getInstancesForInterface<OnStorageReady>('onStorageReady');
    instances.forEach((i) => i.onStorageReady());
  }
}
