import React from 'react';

import { Utils } from '@avalabs/avalanche-wallet-sdk';
import { useWalletContext } from '@src/contexts/WalletProvider';
import {
  LoadingIcon,
  HorizontalFlex,
  VerticalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { Link } from 'react-router-dom';
import { UnlockingSchedule } from './UnlockingSchedule';
import { getAvaxBalanceTotal } from './utils/balanceHelpers';

export function WalletOverview() {
  const { balances } = useWalletContext();

  if (!balances.balanceAvax) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex>
      <HorizontalFlex>
        <VerticalFlex>
          <h1>Total</h1>
          <p>
            <Typography>
              {getAvaxBalanceTotal(balances.balanceAvaxTotal)}
            </Typography>
          </p>
        </VerticalFlex>
      </HorizontalFlex>
      <VerticalFlex>
        <VerticalFlex>
          <h1>X</h1>
          <HorizontalFlex>
            <VerticalFlex>
              <label>Available</label>
              <Typography>
                {Utils.bnToAvaxX(balances.balanceAvax.X.unlocked)}
              </Typography>
            </VerticalFlex>
            <VerticalFlex>
              <label>Locked</label>
              <Typography>
                {Utils.bnToAvaxX(balances.balanceAvax.X.locked)}
              </Typography>
            </VerticalFlex>
          </HorizontalFlex>
        </VerticalFlex>
        <VerticalFlex>
          <h1>P</h1>
          <HorizontalFlex>
            <VerticalFlex>
              <label>Available</label>
              <Typography>
                {Utils.bnToAvaxP(balances.balanceAvax.P.unlocked)}
              </Typography>
            </VerticalFlex>
            <VerticalFlex>
              <label>Locked</label>
              <Typography>
                {Utils.bnToAvaxP(balances.balanceAvax.P.locked)}
              </Typography>
            </VerticalFlex>
            <VerticalFlex>
              <label>Locked Stakeable</label>
              <Typography>
                {Utils.bnToAvaxP(balances.balanceAvax.P.lockedStakeable)}
              </Typography>
            </VerticalFlex>
            <VerticalFlex>
              <label>Staking</label>
              <Typography>{Utils.bnToAvaxP(balances.balanceStaked)}</Typography>
            </VerticalFlex>
          </HorizontalFlex>
        </VerticalFlex>
        <VerticalFlex>
          <h1>C</h1>
          <HorizontalFlex>
            <VerticalFlex>
              <label>Available</label>
              <Typography>{Utils.bnToAvaxC(balances.balanceAvax.C)}</Typography>
            </VerticalFlex>
          </HorizontalFlex>
        </VerticalFlex>
      </VerticalFlex>
      <br />
      <br />
      <Link to={'/wallet'}>
        <PrimaryButton>Back</PrimaryButton>
      </Link>
    </VerticalFlex>
  );
}

export default WalletOverview;
