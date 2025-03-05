export enum GaslessEvents {
  SEND_MESSAGE = 'Gasless: SEND_MESSAGE',
  STATE_UPDATE = 'Gasless: STATE_UPDATE',
}

export interface GaslessMessage {
  name: string;
  data: string;
}

export interface GaslessState {
  solutionHex?: string;
  challengeHex?: string;
  fundTxHex?: string;
  isFundProcessReady?: boolean;
  fundTxDoNotRertyError?: boolean;
}
