import React from 'react';
import { HorizontalFlex } from '@avalabs/react-components';
import { useHistory } from 'react-router';
import { SendReceiveButton } from './SendReceiveButton';

interface SendReceiveToggleProps {
  onShowSend: () => void;
}

export function SendReceiveToggle({ onShowSend }: SendReceiveToggleProps) {
  const history = useHistory();

  return (
    <HorizontalFlex
      width={'100%'}
      justify={'center'}
      align={'center'}
      margin="8px 0 16px"
    >
      <SendReceiveButton
        label={'Send'}
        angle={315}
        onClick={() => onShowSend()}
      />
      <SendReceiveButton
        label={'Receive'}
        angle={135}
        onClick={() => history.push('/receive')}
      />
    </HorizontalFlex>
  );
}
