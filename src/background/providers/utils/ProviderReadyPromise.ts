export enum InitializationStep {
  DOMAIN_METADATA_SENT,
  PROVIDER_STATE_LOADED,
}

export class ProviderReadyPromise {
  #steps: boolean[] = [];
  #inflightRequests: {
    resolve(value: unknown): void;
    fn(): Promise<any>;
  }[] = [];

  constructor() {
    // length / 2 is required since InitializationStep is an enum
    // enums generate objects like this: { key0: 0, key1: 1, 0: key0, 1: key1 }
    this.#steps = Array(Object.keys(InitializationStep).length / 2).fill(false);
  }

  check = (step: InitializationStep) => {
    this.#steps[step] = true;
    this._proceed();
  };

  uncheck = (step: InitializationStep) => {
    this.#steps[step] = false;
  };

  private _proceed = () => {
    if (this.#steps.some((step) => !step)) {
      return;
    }

    while (this.#inflightRequests.length) {
      const request = this.#inflightRequests.shift();
      request?.resolve(request?.fn());
    }
  };

  call = (fn) => {
    return new Promise((resolve) => {
      this.#inflightRequests.push({
        fn,
        resolve,
      });

      this._proceed();
    });
  };
}
