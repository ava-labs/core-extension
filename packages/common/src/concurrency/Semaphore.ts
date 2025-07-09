export class Semaphore {
  #maxConcurrent: number;
  #current: number;
  #queue: ((value?: unknown) => void)[] = [];

  // Think of this like setting up your coffee shop at opening time
  constructor(maxConcurrent = 1) {
    this.#maxConcurrent = maxConcurrent; // How many keys you have (default is 1)
    this.#current = 0; // How many keys are currently in use
    this.#queue = []; // The line of people waiting for a key
  }

  // When someone asks for a key
  async acquire() {
    // If we have an available key
    if (this.#current < this.#maxConcurrent) {
      this.#current++; // Mark one more key as being used
      return Promise.resolve(); // Here's your key, go ahead!
    }

    // If all keys are in use, get in line and wait
    return new Promise((resolve) => {
      this.#queue.push(resolve); // Add person to the waiting line
    });
  }

  // When someone returns a key
  release() {
    this.#current--; // One less key in use

    // If there's people waiting AND we have available keys
    if (this.#queue.length > 0 && this.#current < this.#maxConcurrent) {
      this.#current++; // Mark key as being used
      const next = this.#queue.shift(); // Get first person in line
      next?.(); // Give them the key
    }
  }
}
