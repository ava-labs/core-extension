import React from 'react';
import { observer } from 'mobx-react-lite';
import { VerticalFlex } from '@avalabs/react-components';
import { TransactionSendType } from '@src/store/wallet/types';
import { SendAvaxForm } from '@src/pages/Send/SendAvaxForm';
import { SendAntForm } from '@src/pages/Send/SendAntForm';
import { SendERC20Form } from '@src/pages/Send/SendERC20Form';
import { useLocation, Redirect } from 'react-router-dom';
import { ERC20 } from '@src/store/wallet/types';

type ERC20WithType = ERC20 & { type: TransactionSendType };

export const Send = observer(() => {
  const { state } = useLocation<ERC20WithType>();

  if (!state?.type) {
    return <Redirect to="/wallet" />;
  }

  return (
    <VerticalFlex>
      {
        {
          [TransactionSendType.AVAX]: <SendAvaxForm />,
          [TransactionSendType.ANT]: <SendAntForm />,
          [TransactionSendType.ERC20]: <SendERC20Form token={state} />,
        }[state.type]
      }
    </VerticalFlex>
  );
});
