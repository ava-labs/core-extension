export enum GaslessEvents {
  SEND_MESSAGE = 'Gasless: SEND_MESSAGE',
}

export interface GaslessMessage {
  name: string;
  data: string;
}
