import { HorizontalFlex } from '@avalabs/react-components';
import { useHistory } from 'react-router';
import { SendReceiveButton } from './SendReceiveButton';

export function SendReceiveToggle() {
  const history = useHistory();

  return (
    <HorizontalFlex
      width="100%"
      justify="center"
      align="center"
      margin="8px 0 24px"
    >
      <SendReceiveButton
        label="Send"
        angle={315}
        onClick={() => history.push('/send')}
      />
      <SendReceiveButton
        label="Receive"
        angle={135}
        onClick={() => history.push('/receive')}
      />
    </HorizontalFlex>
  );
}
