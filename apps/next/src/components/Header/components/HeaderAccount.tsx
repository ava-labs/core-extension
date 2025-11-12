import { Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { HeaderWalletDetails } from '../types';
import { useHistory } from 'react-router-dom';

type Props = {
  wallet: HeaderWalletDetails;
  account: Account;
};

export const HeaderAccount: FC<Props> = ({ wallet, account }) => {
  const history = useHistory();
  return (
    <>
      <Typography
        variant="body2"
        onClick={() => history.push(`/portfolio/wallet/${wallet.id}`)}
      >
        {wallet.name}
      </Typography>
      <MdNavigateNext />
      <Typography variant="body2" onClick={() => history.push(`/portfolio`)}>
        {account.name}
      </Typography>
    </>
  );
};
