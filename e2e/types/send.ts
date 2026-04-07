/**
 * Send transaction data for E2E tests
 */
export interface SendTransactionData {
  tokenSymbol: string;
  amount: string;
  recipientAddress?: string;
  recipientAccount?: string;
}
