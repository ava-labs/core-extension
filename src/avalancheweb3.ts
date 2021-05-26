interface Window {
  testproperty: any;
  avalanche: any;
}

class Avalanche {
  constructor() {}

  test() {
    console.log('line 5');
    return 'test';
  }

  getAddress() {
    return 'asdfasdfasasdf';
  }
}
window.avalanche = new Avalanche();
const asdf = () => {
  // alert('asdf');
  console.log('avalanche', window.avalanche);

  window.avalanche.test();
};

asdf();
