import { action, makeAutoObservable, observable } from 'mobx';

class AssetsStore {
  data: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addData = (item: string) => {
    this.data.push(item);
  };

  removeData = (item: string) => {
    this.data.splice(this.data.indexOf(item), 1);
  };
}

export default AssetsStore;
