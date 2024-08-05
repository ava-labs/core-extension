enum TransactionTimeEvents {
  TRANSACTION_TIMED = 'transaction-timed',
  TRANSACTION_SUCCEEDED = 'transaction-succeeded',
  TRANSACTION_APPROVED = 'transaction-approved',
}

export const measureTransactionTime = (): {
  startMeasure: () => void;
  endMeasure: (callback: (duration: number) => void) => void;
} => {
  const startMeasure = () => {
    performance.mark(TransactionTimeEvents.TRANSACTION_APPROVED);
  };

  const endMeasure = (callback: (duration: number) => void) => {
    performance.mark(TransactionTimeEvents.TRANSACTION_SUCCEEDED);

    const measurement = performance.measure(
      TransactionTimeEvents.TRANSACTION_TIMED,
      TransactionTimeEvents.TRANSACTION_APPROVED,
      TransactionTimeEvents.TRANSACTION_SUCCEEDED
    );

    performance.clearMarks(TransactionTimeEvents.TRANSACTION_APPROVED);
    performance.clearMarks(TransactionTimeEvents.TRANSACTION_SUCCEEDED);
    performance.clearMarks(TransactionTimeEvents.TRANSACTION_TIMED);

    callback(measurement.duration);
  };

  return { startMeasure, endMeasure };
};
