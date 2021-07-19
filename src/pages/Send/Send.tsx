import React from 'react';
import { observer } from 'mobx-react-lite';
import { VerticalFlex } from '@avalabs/react-components';
import { TransactionSendType } from '@src/store/wallet/types';
import { SendAvaxForm } from '@src/pages/Send/SendAvaxForm';
import { SendAntForm } from '@src/pages/Send/SendAntForm';
import { SendERC20Form } from '@src/pages/Send/SendERC20Form';
import { useLocation, Redirect } from 'react-router-dom';

export const Send = observer(() => {
  /**
   * using any until we do some type checking and error
   * handling at this level. The proper types here are:
   * {type: string} ||
   * {type: string} & BalanceX ||
   * {type: string} & ERC20
   */
  const { state } = useLocation<any>();

  if (!state?.type) {
    return <Redirect to="/wallet" />;
  }

  return (
    <VerticalFlex>
      {
        {
          [TransactionSendType.AVAX]: <SendAvaxForm />,
          [TransactionSendType.ANT]: <SendAntForm token={state} />,
          [TransactionSendType.ERC20]: <SendERC20Form token={state} />,
        }[state.type]
      }
    </VerticalFlex>
  );
});
