import { action, makeAutoObservable, autorun, observable } from 'mobx';
import { clearPersist, stopPersist, startPersist } from 'mobx-persist-store';
import { persistStore } from '@src/utils/mobx';

class OnboardStore {
  isOnboarded: boolean = false;
  currentPosition: number = 1;
  password: string = '';

  constructor() {
    makeAutoObservable(this);
    persistStore(this, ['currentPosition', 'isOnboarded'], 'OnboardStore');
  }

  incrementPosition() {
    this.currentPosition++;
  }

  goBack() {
    this.currentPosition--;
  }

  setPassword(password: string) {
    this.password = password;
  }

  clearPassword() {
    this.password = '';
  }

  markOnboarded() {
    this.isOnboarded = true;
  }

  async clearStore() {
    await clearPersist(this);
  }

  stopPersist() {
    stopPersist(this);
  }

  startPersist() {
    startPersist(this);
  }

  // autorun() {
  //   console.log(this.currentPosition);
  // }
}

export default OnboardStore;
