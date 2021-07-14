import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  VerticalFlex,
  LoadingIcon,
  HorizontalFlex,
  Typography,
  PrimaryButton,
} from '@avalabs/react-components';
import { TransactionSendType } from '@src/store/wallet/types';
import { SendAvaxForm } from '@src/pages/Send/SendAvaxForm';
import { SendAntForm } from '@src/pages/Send/SendAntForm';
import { SendERC20Form } from '@src/pages/Send/SendERC20Form';
import { useLocation } from 'react-router-dom';

export const Send = observer(() => {
  const { state } = useLocation<{ type: TransactionSendType }>();

  return (
    <VerticalFlex>
      {
        {
          [TransactionSendType.AVAX]: <SendAvaxForm />,
          [TransactionSendType.ANT]: <SendAntForm />,
          [TransactionSendType.ERC20]: <SendERC20Form />,
        }[state.type]
      }
    </VerticalFlex>
  );
});
