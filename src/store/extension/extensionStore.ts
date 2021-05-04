import { action, makeAutoObservable, observable } from 'mobx';
import extension from 'extensionizer';

class ExtensionStore {
  isDarkMode: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }
  reload() {
    extension.runtime.reload();
  }

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
}

export default ExtensionStore;
