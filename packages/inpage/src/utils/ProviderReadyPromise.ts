export enum InitializationStep {
  DOMAIN_METADATA_SENT = 'domain_metadata_sent',
  PROVIDER_STATE_LOADED = 'provider_state_loaded',
}

export class ProviderReadyPromise {
  #unpreparedSteps: Map<InitializationStep, boolean> = new Map();
  #inflightRequests: {
    resolve(value: unknown): void;
    fn(): Promise<unknown>;
  }[] = [];

  constructor(steps: InitializationStep[]) {
    steps.map((step) => this.#unpreparedSteps.set(step, true));
  }

  check = (step: InitializationStep) => {
    const hasStep = this.#unpreparedSteps.has(step);

    if (hasStep) {
      this.#unpreparedSteps.delete(step);
    }

    this._proceed();
  };

  uncheck = (step: InitializationStep) => {
    this.#unpreparedSteps.set(step, true);
  };

  private _proceed = () => {
    if (this.#unpreparedSteps.size) {
      return;
    }

    while (this.#inflightRequests.length) {
      const request = this.#inflightRequests.shift();
      request?.resolve(request?.fn());
    }
  };

  call = (fn: () => Promise<unknown>) => {
    return new Promise((resolve) => {
      this.#inflightRequests.push({
        fn,
        resolve,
      });

      this._proceed();
    });
  };
}
