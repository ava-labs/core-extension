import { Account } from './account';

export type AddressType = keyof {
  [AK in keyof Account as AK extends `address${infer VM}` ? VM : never]: AK;
};
