import { Fade, QrCodeIcon, SquareButton } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import {
  useAccountsContext,
  useAnalyticsContext,
  useFeatureFlagContext,
  useOnline,
} from '@core/ui';
import { OfflineTooltip } from '@/components/OfflineTooltip';

import {
  getBridgePath,
  getFusionPath,
  getSendPath,
  getSwapPath,
} from '@/config/routes';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { getCoreWebUrl } from '@core/common/src/utils/getCoreWebUrl';
import { openNewTab } from '@core/common/src/utils/extensionUtils';
import { useTranslation } from 'react-i18next';
import { SendIcon } from '@/components/SendIcon';
import { SwapIcon } from '@/components/SwapIcon';
import { BridgeIcon } from '@/components/BridgeIcon';
import { BuyIcon } from '@/components/BuyIcon';
import {
  FeatureGates,
  FungibleTokenBalance,
  getUniqueTokenId,
  isNativeToken,
  NetworkWithCaipId,
} from '@core/types';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import { chainIdToCaip } from '@core/common';
import { FaExplosion } from 'react-icons/fa6';
import { NoScrollStack } from '@/components/NoScrollStack';

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
  const { isFlagEnabled } = useFeatureFlagContext();
  const { checkIsFunctionSupported } = useIsFunctionAvailable({ network });
  const { t } = useTranslation();
  const { supportsAsset } = useNextUnifiedBridgeContext();
  const isSwapSupported = checkIsFunctionSupported(FunctionNames.SWAP);
  const isBuySupported = checkIsFunctionSupported(FunctionNames.BUY);
  const { isOnline } = useOnline();
  const history = useHistory();
  const isBridgeSupported =
    !token ||
    supportsAsset(
      isNativeToken(token) ? token.symbol : token.address,
      chainIdToCaip(token.coreChainId),
    );
  const tokenId = token ? getUniqueTokenId(token) : '';
  const tokenNetwork = token ? chainIdToCaip(token.coreChainId) : '';
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  let delay = 0;
  const getDelay = () => (delay += 300);

  return (
    <NoScrollStack
      autoHide
      autoHeight
      autoHeightMin={80}
      autoHeightMax={80}
      stackProps={{
        direction: 'row',
        gap: 1,
      }}
    >
      {isFlagEnabled(FeatureGates.FUSION_PROJECT) ? (
        <Fade in timeout={getDelay()} easing="ease-out">
          <OfflineTooltip placement="top">
            <SquareButton
              variant="extension"
              icon={<FaExplosion size={ICON_SIZE} />}
              label={t('Fusion')}
              onClick={() => {
                capture('TokenSwapClicked');
                push(getFusionPath({ from: tokenId }));
              }}
            />
          </OfflineTooltip>
        </Fade>
      ) : (
        isSwapSupported && (
          <Fade in timeout={getDelay()} easing="ease-out">
            <OfflineTooltip placement="top">
              <SquareButton
                variant="extension"
                icon={<SwapIcon size={ICON_SIZE} />}
                label={t('Swap')}
                onClick={() => {
                  capture('TokenSwapClicked');
                  push(getSwapPath({ from: tokenId }));
                }}
              />
            </OfflineTooltip>
          </Fade>
        )
      )}

      {isBridgeSupported && (
        <Fade in timeout={getDelay()} easing="ease-out">
          <OfflineTooltip placement="top">
            <SquareButton
              variant="extension"
              icon={<BridgeIcon size={ICON_SIZE} />}
              label={t('Bridge')}
              onClick={() => {
                capture('TokenBridgeClicked');
                push(
                  getBridgePath({
                    sourceToken: tokenId,
                    sourceNetwork: tokenNetwork,
                  }),
                );
              }}
              disabled={!isOnline}
            />
          </OfflineTooltip>
        </Fade>
      )}

      <Fade in timeout={getDelay()} easing="ease-out">
        <OfflineTooltip placement="top">
          <SquareButton
            variant="extension"
            icon={<SendIcon size={ICON_SIZE} />}
            label={t('Send')}
            onClick={() => {
              capture('TokenSendClicked');
              push(getSendPath({ token: tokenId }));
            }}
            disabled={!isOnline}
          />
        </OfflineTooltip>
      </Fade>

      <Fade in timeout={getDelay()} easing="ease-out">
        <OfflineTooltip placement="top">
          <SquareButton
            variant="extension"
            icon={<QrCodeIcon size={ICON_SIZE} />}
            label={t('Receive')}
            onClick={() => {
              capture('TokenReceiveClicked', { addressType: 'C' });
              history.push(`/receive?accId=${activeAccount?.id}`);
            }}
          />
        </OfflineTooltip>
      </Fade>

      {isBuySupported && (
        <Fade in timeout={getDelay()} easing="ease-out">
          <SquareButton
            variant="extension"
            icon={<BuyIcon size={ICON_SIZE} />}
            label={t('Buy')}
            onClick={() => {
              capture('TokenBuyClicked');
              openNewTab({ url: `${getCoreWebUrl()}/buy` });
            }}
          />
        </Fade>
      )}
    </NoScrollStack>
  );
};
