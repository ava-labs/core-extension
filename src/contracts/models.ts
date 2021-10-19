export interface KnownContract {
  docs: string;
  name: string;
  abi: any;
  decoder(data: any): JSON;
  parser(data: any): any;
}

export type KNownContractHelperMap = [string, KnownContract];
