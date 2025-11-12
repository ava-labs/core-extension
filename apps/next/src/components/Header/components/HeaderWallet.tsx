import { PersonalAvatar } from '@/components/PersonalAvatar';
import { FC } from 'react';
import { HeaderWalletDetails } from '../types';

type Props = {
  wallet: HeaderWalletDetails;
};

export const HeaderWallet: FC<Props> = ({ wallet }) => {
  return (
    <>
      <PersonalAvatar cached size="xsmall" sx={{ mr: 1 }} />
      <div>{wallet.name}</div>
    </>
  );
};
