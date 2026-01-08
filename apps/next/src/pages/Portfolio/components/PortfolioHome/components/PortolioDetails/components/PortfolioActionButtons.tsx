import { Slide, SquareButton, Stack } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@core/ui';

import { getBridgePath, getSendPath, getSwapPath } from '@/config/routes';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { getCoreWebUrl } from '@core/common/src/utils/getCoreWebUrl';
import { openNewTab } from '@core/common/src/utils/extensionUtils';
import { useTranslation } from 'react-i18next';
import { SendIcon } from '@/components/SendIcon';
import { SwapIcon } from '@/components/SwapIcon';
import { BridgeIcon } from '@/components/BridgeIcon';
import { BuyIcon } from '@/components/BuyIcon';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import { chainIdToCaip } from '@core/common';

const ICON_SIZE = 20;

export const PortfolioActionButtons = ({
  network,
  token,
}: {
  network?: NetworkWithCaipId;
  token?: FungibleTokenBalance;
}) => {
  const { push } = useHistory();
  const { capture } = useAnalyticsContext();
  const { checkIsFunctionSupported } = useIsFunctionAvailable({ network });
  const { t } = useTranslation();
  const isSwapSupported = checkIsFunctionSupported(FunctionNames.SWAP);
  const isBuySupported = checkIsFunctionSupported(FunctionNames.BUY);

  let delay = 0;
  const getDelay = () => (delay += 300);

  // Get unique token ID if token is provided
  const tokenId = token ? getUniqueTokenId(token) : undefined;

  return (
    <Stack direction="row" gap={1} width="100%">
      {/* TODO: create the proper animation */}

      {isSwapSupported && (
        <Slide direction="left" in timeout={getDelay()} easing="ease-out">
          <SquareButton
            variant="extension"
            icon={<SwapIcon size={ICON_SIZE} />}
            label={t('Swap')}
            onClick={() => {
              capture('TokenSwapClicked');
              push(getSwapPath(tokenId ? { from: tokenId } : undefined));
            }}
          />
        </Slide>
      )}

      <Slide direction="left" in timeout={getDelay()} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<BridgeIcon size={ICON_SIZE} />}
          label={t('Bridge')}
          onClick={() => {
            capture('TokenBridgeClicked');
            push(
              getBridgePath(
                token
                  ? {
                      sourceToken: tokenId,
                      sourceNetwork: chainIdToCaip(token.coreChainId),
                    }
                  : undefined,
              ),
            );
          }}
        />
      </Slide>

      <Slide direction="left" in timeout={getDelay()} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<SendIcon size={ICON_SIZE} />}
          label={t('Send')}
          onClick={() => {
            capture('TokenSendClicked');
            push(getSendPath(tokenId ? { token: tokenId } : undefined));
          }}
        />
      </Slide>

      {isBuySupported && (
        <Slide direction="left" in timeout={getDelay()} easing="ease-out">
          <SquareButton
            variant="extension"
            icon={<BuyIcon size={ICON_SIZE} />}
            label={t('Buy')}
            onClick={() => {
              capture('TokenBuyClicked');
              openNewTab({ url: `${getCoreWebUrl()}/buy` });
            }}
          />
        </Slide>
      )}
    </Stack>
  );
};
