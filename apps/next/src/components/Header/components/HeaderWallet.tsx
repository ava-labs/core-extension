import { PersonalAvatar } from '@/components/PersonalAvatar';
import { FC } from 'react';
import { HeaderWalletDetails } from '../types';
import { useHistory } from 'react-router-dom';
import { Typography } from '@avalabs/k2-alpine';

type Props = {
  wallet: HeaderWalletDetails;
};

export const HeaderWallet: FC<Props> = ({ wallet }) => {
  const history = useHistory();
  return (
    <>
      <PersonalAvatar cached size="xsmall" sx={{ mr: 1 }} />
      <Typography
        variant="body2"
        onClick={() => history.push('/account-management')}
      >
        {wallet.name}
      </Typography>
    </>
  );
};
