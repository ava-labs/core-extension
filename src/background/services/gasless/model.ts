export enum GaslessEvents {
  SEND_OFFSCREEN_MESSAGE = 'Gasless: SEND_OFFSCREEN_MESSAGE',
  STATE_UPDATE = 'Gasless: STATE_UPDATE',
}

export interface GaslessMessage {
  name: string;
  data: string;
}

export interface GaslessStateValues {
  solutionHex?: string;
  challengeHex?: string;
  fundTxHex?: string;
  isFundInProgress?: boolean;
  fundTxDoNotRetryError?: boolean;
}
export interface GaslessState {
  solutionHex: string;
  challengeHex: string;
  fundTxHex: string;
  fundTxDoNotRetryError: boolean;
  isFundInProgress: boolean;
}

export enum GaslessPhase {
  NOT_READY = 'not_ready',
  NOT_ELIGIBLE = 'not_eligible',
  READY = 'ready',
  FUNDING_IN_PROGRESS = 'funding_in_progress',
  FUNDED = 'funded',
  ERROR = 'error',
}
