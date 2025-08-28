import {
  BridgeIcon,
  SendIcon,
  SquareButton,
  Stack,
  SwapIcon,
  toast,
} from '@avalabs/k2-alpine';
import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { getSendPath } from '@/config/routes';

const onNotImplementedClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  toast.info(
    `🚧 The ${e.currentTarget.innerText} feature is coming soon! Stay tuned for updates! ✨🚀`,
    {
      id: 'not-implemented-toast',
      duration: 1000,
    },
  );
};

const ICON_SIZE = 19.2;

export const PortfolioActionButtons = () => {
  const { push } = useHistory();
  return (
    <Stack direction="row" gap={1}>
      <SquareButton
        variant="extension"
        icon={<SendIcon size={ICON_SIZE} />}
        label="Send"
        onClick={() => push(getSendPath())}
      />

      <SquareButton
        variant="extension"
        icon={<SwapIcon size={ICON_SIZE} />}
        label="Swap"
        onClick={onNotImplementedClick}
      />
      <SquareButton
        variant="extension"
        icon={<MdAdd size={ICON_SIZE} />}
        label="Buy"
        onClick={onNotImplementedClick}
      />
      <SquareButton
        variant="extension"
        icon={<BridgeIcon size={ICON_SIZE} />}
        label="Bridge"
        onClick={onNotImplementedClick}
      />
    </Stack>
  );
};
