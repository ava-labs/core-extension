export type ImportMissingKeysStatus =
  | 'idle'
  | 'initialized'
  | 'connecting'
  | 'importing'
  | 'connected'
  | 'success'
  | 'connection-error'
  | 'incorrect-device'
  | 'verifying-device'
  | 'import-error';
