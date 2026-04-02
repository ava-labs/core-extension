export type ImportMissingKeysStatus =
  | 'waiting'
  | 'importing'
  | 'connected'
  | 'request-approved'
  | 'request-rejected'
  | 'incorrect-device-error'
  | 'import-error';
