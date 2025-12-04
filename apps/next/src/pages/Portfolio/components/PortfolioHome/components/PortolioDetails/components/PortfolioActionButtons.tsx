import {
  BridgeIcon,
  SendIcon,
  Slide,
  SquareButton,
  Stack,
  SwapIcon,
} from '@avalabs/k2-alpine';
import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { getBridgePath, getSendPath, getSwapPath } from '@/config/routes';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { getCoreWebUrl } from '@core/common/src/utils/getCoreWebUrl';
import { openNewTab } from '@core/common/src/utils/extensionUtils';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = 19.2;

export const PortfolioActionButtons = () => {
  const { push } = useHistory();
  const { checkIsFunctionSupported } = useIsFunctionAvailable();
  const { t } = useTranslation();
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
          label={t('Send')}
          onClick={() => push(getSendPath())}
        />
      </Slide>

      {isSwapSupported && (
        <Slide direction="left" in timeout={getDelay()} easing="ease-out">
          <SquareButton
            variant="extension"
            icon={<SwapIcon size={ICON_SIZE} />}
            label={t('Swap')}
            onClick={() => push(getSwapPath())}
          />
        </Slide>
      )}

      {isBuySupported && (
        <Slide direction="left" in timeout={getDelay()} easing="ease-out">
          <SquareButton
            variant="extension"
            icon={<MdAdd size={ICON_SIZE} />}
            label={t('Buy')}
            onClick={() => {
              openNewTab({ url: `${getCoreWebUrl()}/buy` });
            }}
          />
        </Slide>
      )}
      <Slide direction="left" in timeout={getDelay()} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<BridgeIcon size={ICON_SIZE} />}
          label={t('Bridge')}
          onClick={() => push(getBridgePath())}
        />
      </Slide>
    </Stack>
  );
};
