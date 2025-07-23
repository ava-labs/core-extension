export enum ContextContainer {
  POPUP = '/popup.html', // this is extension when it opens
  CONFIRM = '/confirm.html', // this is used for confirms from dApps
  HOME = '/home.html', // This is used for tabs where the wallet is opened
  FULLSCREEN = '/fullscreen.html', // This is used for flows that are performed in a full tab (i.e. first ledger connection, seedless MFA setups, etc.)
  SIDE_PANEL = '/sidePanel.html', // This is used for side panel mode
}
