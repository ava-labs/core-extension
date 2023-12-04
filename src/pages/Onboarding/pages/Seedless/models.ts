export enum FIDOSteps {
  NAMING = 'naming',
  REGISTER = 'register',
  LOGIN = 'login',
  ERROR = 'error',
}

// When the user wants to login with a FIDO device, we don't get the device exact type (e.g. passkey or yubikey), only we get the tpye it is 'fido"
// so we need to handle them as a unit in the login process
export enum RecoveryMethodTypes {
  PASSKEY = 'passkey',
  TOTP = 'totp',
  YUBIKEY = 'yubikey',
  FIDO = 'fido',
  UNKNOWN = 'unknown',
}
