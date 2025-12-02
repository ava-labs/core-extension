import {
  BridgeIcon,
  SendIcon,
  Slide,
  SquareButton,
  Stack,
  SwapIcon,
  toast,
} from '@avalabs/k2-alpine';
import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { getBridgePath, getSendPath, getSwapPath } from '@/config/routes';

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

const ICON_SIZE = 24;

export const PortfolioActionButtons = () => {
  const { push } = useHistory();
  return (
    <Stack direction="row" gap={1} width="100%">
      {/* TODO: create the proper animation */}
      <Slide direction="left" in timeout={300} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<SendIcon size={ICON_SIZE} />}
          label="Send"
          onClick={() => push(getSendPath())}
          sx={{
            px: 1.5,
            width: 60,
            height: 60,
            gap: 0,
            justifyContent: 'space-between',
            '& > span': { lineHeight: 1.2 },
          }}
        />
      </Slide>
      <Slide direction="left" in timeout={600} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<SwapIcon size={ICON_SIZE} />}
          label="Swap"
          onClick={() => push(getSwapPath())}
        />
      </Slide>
      <Slide direction="left" in timeout={900} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<MdAdd size={ICON_SIZE} />}
          label="Buy"
          onClick={onNotImplementedClick}
        />
      </Slide>
      <Slide direction="left" in timeout={1200} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<BridgeIcon size={ICON_SIZE} />}
          label="Bridge"
          onClick={() => push(getBridgePath())}
        />
      </Slide>
    </Stack>
  );
};
