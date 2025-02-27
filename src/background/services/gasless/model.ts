export enum GaslessEvents {
  SEND_MESSAGE = 'Gasless: SEND_MESSAGE',
  CHALLENGE_UPDATE = 'Gasless: CHALLENGE_UPDATE',
}

export interface GaslessMessage {
  name: string;
  data: string;
}

// TODO: fix the type
export interface GaslessChallange {
  any;
}
