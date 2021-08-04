import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

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
import { UTXOSet } from 'avalanche/dist/apis/platformvm';

export const WalletOverview = observer(() => {
  const { balances, wallet } = useWalletContext();
  const [utxoSet, setUtxoSet] = useState<UTXOSet>();

  useEffect(() => {
    /**
     * We have type for UTXOSet coming from avalanche sdk and the wallet sdk
     * so for now we will cast it
     */
    wallet && setUtxoSet(wallet.getUtxosP() as unknown as UTXOSet);
  }, [balances.balanceAvaxTotal, wallet]);

  if (!wallet || !balances.balanceAvax) {
    return <LoadingIcon />;
  }

  return (
    <VerticalFlex>
      <HorizontalFlex>
        <VerticalFlex>
          <h1>Total</h1>
          <p>
            <Typography>{balances.getAvaxBalanceTotal()}</Typography>
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
      {utxoSet ? (
        <VerticalFlex>
          <h1>Unlocking Schedule </h1>
          <UnlockingSchedule utxoSet={utxoSet} />
        </VerticalFlex>
      ) : (
        ''
      )}
      <br />
      <br />
      <Link to={'/wallet'}>
        <PrimaryButton>Back</PrimaryButton>
      </Link>
    </VerticalFlex>
  );
});

export default WalletOverview;
