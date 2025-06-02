// Shared types and interfaces for AccountManagement components

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  accounts: Account[];
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}
