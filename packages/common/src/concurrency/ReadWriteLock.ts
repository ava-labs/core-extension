import { EventEmitter } from 'events';

import { Mutex } from './Mutex';

export class ReadWriteLock {
  #mutex: Mutex;
  #emitter: EventEmitter;
  #readCount: number;
  #writeCount: number;
  #waitingWriters: number;

  constructor() {
    this.#mutex = new Mutex();
    this.#emitter = new EventEmitter();
    this.#readCount = 0;
    this.#writeCount = 0;
    this.#waitingWriters = 0;
  }

  async acquireReadLock() {
    await this.#mutex.lock();
    try {
      if (this.#writeCount > 0 || this.#waitingWriters > 0) {
        const readPromise = new Promise<void>((resolve) => {
          this.#emitter.once('writeComplete', resolve);
        });
        this.#mutex.unlock();
        await readPromise;
        await this.#mutex.lock();
      }
      this.#readCount++;
    } finally {
      this.#mutex.unlock();
    }
  }

  async releaseReadLock() {
    await this.#mutex.lock();
    try {
      this.#readCount--;
      if (this.#readCount === 0) {
        this.#emitter.emit('readComplete');
      }
    } finally {
      this.#mutex.unlock();
    }
  }

  async acquireWriteLock() {
    await this.#mutex.lock();
    try {
      this.#waitingWriters++;
      if (this.#writeCount > 0 || this.#readCount > 0) {
        const writePromise = new Promise<void>((resolve) => {
          const handler = () => {
            this.#emitter.removeListener('readComplete', handler);
            this.#emitter.removeListener('writeComplete', handler);
            resolve();
          };
          this.#emitter.on('readComplete', handler);
          this.#emitter.on('writeComplete', handler);
        });
        this.#mutex.unlock();
        await writePromise;
        await this.#mutex.lock();
      }
      this.#waitingWriters--;
      this.#writeCount++;
    } finally {
      this.#mutex.unlock();
    }
  }

  async releaseWriteLock() {
    await this.#mutex.lock();
    try {
      this.#writeCount--;
      this.#emitter.emit('writeComplete');
    } finally {
      this.#mutex.unlock();
    }
  }
}
