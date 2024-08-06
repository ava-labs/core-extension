export enum InitializationStep {
  DOMAIN_METADATA_SENT = 'domain_metadata_sent',
  PROVIDER_STATE_LOADED = 'provider_state_loaded',
}

export class ProviderReadyPromise {
  #unpreparedSteps: InitializationStep[] = [];
  #inflightRequests: {
    resolve(value: unknown): void;
    fn(): Promise<any>;
  }[] = [];

  constructor(steps: InitializationStep[]) {
    this.#unpreparedSteps = Object.values(steps);
  }

  check = (step: InitializationStep) => {
    const stepIndex = this.#unpreparedSteps.findIndex(
      (currentStep) => step === currentStep
    );

    if (stepIndex > -1) {
      this.#unpreparedSteps.splice(stepIndex, 1);
    }

    this._proceed();
  };

  uncheck = (step: InitializationStep) => {
    this.#unpreparedSteps[step] = step;
  };

  private _proceed = () => {
    if (this.#unpreparedSteps.length) {
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
