import { TransactionSendType } from '@src/pages/Send/models';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const supportedSendTypes = [
  TransactionSendType.AVAX,
  TransactionSendType.ANT,
  TransactionSendType.ERC20,
];

export function useGetSendTypeFromParams() {
  const { search } = useLocation();
  const [sendType, setSendType] = useState<TransactionSendType>();

  useEffect(() => {
    // need to update ts target version so support this feature, browser supports it
    const { type } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    supportedSendTypes.includes(type) && setSendType(type);
  }, [search]);

  return sendType;
}
