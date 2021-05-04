import { makeAutoObservable } from 'mobx';
import { persistStore } from '@src/utils/mobx';

class ThemeStore {
  isDarkMode: boolean = true;

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['isDarkMode'], 'ThemeStore');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
}

export default ThemeStore;
