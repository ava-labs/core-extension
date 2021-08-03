import { makeAutoObservable } from 'mobx';
import extension from 'extensionizer';
import { persistStore } from '@src/utils/mobx';
class ExtensionStore {
  get isUnlocked() {
    return true;
  }
  timer: any = null;
  timeoutMinutes: number = 0;

  constructor() {
    makeAutoObservable(this);
    persistStore(this, [], 'ExtensionStore');
  }
  reload() {
    extension.runtime.reload();
  }

  setLastActiveTime() {
    this.resetTimer();
  }

  setInactiveTimeout(timeoutMinutes) {
    this.timeoutMinutes = timeoutMinutes;

    this.resetTimer();
  }

  resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (!this.timeoutMinutes) {
      return;
    }
    /**
     * Not sure we need this yet or what its suppose to do
     */
    // this.timer = setTimeout(
    //   () => this.setLocked(),
    //   this.timeoutMinutes * 60 * 1000
    // );
  }

  // setLocked(): void {
  //   this.isUnlocked = false;
  // }

  openWindow(url: string) {
    extension.tabs.create(url);
  }

  openExtensionInBrowser(route = null, queryString = null) {
    let extensionURL = extension.runtime.getURL('popup.html');

    if (queryString) {
      extensionURL += `?${queryString}`;
    }

    if (route) {
      extensionURL += `#${route}`;
    }
    this.openWindow(extensionURL);
  }

  getActiveTabs() {
    return new Promise((resolve, reject) => {
      extension.tabs.query({ active: true }, (tabs) => {
        return resolve(tabs);
      });
    });
  }

  getAllWindows() {
    return new Promise((resolve, reject) => {
      extension.windows.getAll((windows) => {
        return resolve(windows);
      });
    });
  }

  currentTab() {
    return new Promise((resolve, reject) => {
      extension.tabs.getCurrent((tab) => {
        resolve(tab);
      });
    });
  }

  switchToTab(tabId) {
    return new Promise((resolve, reject) => {
      extension.tabs.update(tabId, { highlighted: true }, (tab) => {
        resolve(tab);
      });
    });
  }

  closeTab(tabId) {
    extension.tabs.remove(tabId);
    // return new Promise((resolve, reject) => {
    //   extension.tabs.remove(tabId, () => {
    //     resolve();
    //   });
    // });
  }
}

export default ExtensionStore;
