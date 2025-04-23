import { Transaction } from '@core/service-worker';

export function getToAddressesFromTransaction(transaction: Transaction): {
  to?: string;
  contractAddress?: string;
} {
  const addresses = transaction.displayValues?.actions.reduce(
    (acc, action) => {
      if ('toAddress' in action) {
        acc.to.push(action.toAddress);
      } else if ('contract' in action && action.contract?.address) {
        acc.contractAddress.push(action.contract.address);
      }

      return acc;
    },
    { to: [] as string[], contractAddress: [] as string[] },
  );

  return {
    to: addresses?.to.length ? addresses.to.join(', ') : undefined,
    contractAddress: addresses?.contractAddress.length
      ? addresses.contractAddress.join(', ')
      : undefined,
  };
}
