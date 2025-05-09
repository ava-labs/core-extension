/**
 * Called when the wallet gets locked
 * Use it for cleaning up local states, and connections
 * When the wallet is locked, we should not store any remotely sensitive info in memory
 */
export interface OnLock {
  onLock(): void | Promise<void>;
}

/**
 * Called when the wallet gets unlocked
 * Continue watching for updates and do initialization on things which don't need encrypted storage
 */
export interface OnUnlock {
  onUnlock(): void | Promise<void>;
}

/**
 * Called when the storage has the storage key and can be used
 */
export interface OnStorageReady {
  onStorageReady(): void | Promise<void>;
}

/**
 * Called when all extension popups disconnect from the backend script.
 */
export interface OnAllExtensionClosed {
  onAllExtensionsClosed(): void | Promise<void>;
}
