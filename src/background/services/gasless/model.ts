export enum GaslessEvents {
  SEND_MESSAGE = 'Gasless: SEND_MESSAGE',
  CHALLENGE_UPDATE = 'Gasless: CHALLENGE_UPDATE',
}

export interface GaslessMessage {
  name: string;
  data: string;
}

export interface GaslessChallange {
  solutionHex?: string;
  challengeHex?: string;
  fundTxHex?: string;
  isFundProcessReady?: boolean;
  fundTxDoNotRertyError?: boolean;
}
