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
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';

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
  const { checkIsFunctionSupported } = useIsFunctionAvailable();

  const isSwapSupported = checkIsFunctionSupported(FunctionNames.SWAP);
  const isBuySupported = checkIsFunctionSupported(FunctionNames.BUY);

  let delay = 0;
  const getDelay = () => (delay += 300);

  return (
    <Stack direction="row" gap={1} width="100%">
      {/* TODO: create the proper animation */}
      <Slide direction="left" in timeout={getDelay()} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<SendIcon size={ICON_SIZE} />}
          label="Send"
          onClick={() => push(getSendPath())}
        />
      </Slide>

      {isSwapSupported && (
        <Slide direction="left" in timeout={getDelay()} easing="ease-out">
          <SquareButton
            variant="extension"
            icon={<SwapIcon size={ICON_SIZE} />}
            label="Swap"
            onClick={() => push(getSwapPath())}
          />
        </Slide>
      )}

      {isBuySupported && (
        <Slide direction="left" in timeout={getDelay()} easing="ease-out">
          <SquareButton
            variant="extension"
            icon={<MdAdd size={ICON_SIZE} />}
            label="Buy"
            onClick={onNotImplementedClick}
          />
        </Slide>
      )}
      <Slide direction="left" in timeout={getDelay()} easing="ease-out">
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
