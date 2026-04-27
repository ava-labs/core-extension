import { Fade, QrCodeIcon, SquareButton } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import {
  useAccountsContext,
  useAnalyticsContext,
  useFeatureFlagContext,
  useOnline,
} from '@core/ui';
import { OfflineTooltip } from '@/components/OfflineTooltip';

import { getFusionPath, getSendPath } from '@/config/routes';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { getCoreWebUrl } from '@core/common/src/utils/getCoreWebUrl';
import { openNewTab } from '@core/common/src/utils/extensionUtils';
import { useTranslation } from 'react-i18next';
import { SendIcon } from '@/components/SendIcon';
import { SwapIcon } from '@/components/SwapIcon';
import { BuyIcon } from '@/components/BuyIcon';
import {
  FeatureGates,
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import { NoScrollStack } from '@/components/NoScrollStack';
import { getAddressTypeForToken } from '@/lib/getAddressTypeForToken';

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
  const isBuySupported = checkIsFunctionSupported(FunctionNames.BUY);
  const { isOnline } = useOnline();
  const history = useHistory();
  const tokenId = token ? getUniqueTokenId(token) : '';
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  let delay = 0;
  const getDelay = () => (delay += 300);

  const isFusionEnabled = isFlagEnabled(FeatureGates.FUSION_FEATURE);

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
      {isFusionEnabled && (
        <Fade in timeout={getDelay()} easing="ease-out">
          <OfflineTooltip placement="top">
            <SquareButton
              variant="extension"
              icon={<SwapIcon size={ICON_SIZE} />}
              label={t('Swap')}
              onClick={() => {
                capture('TokenSwapClicked');
                push(getFusionPath({ from: tokenId }));
              }}
            />
          </OfflineTooltip>
        </Fade>
      )}

      <Fade in timeout={getDelay()} easing="ease-out">
        <OfflineTooltip placement="top">
          <SquareButton
            data-testid="send-nav-button"
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
              const addressType = token ? getAddressTypeForToken(token) : 'C';

              capture('TokenReceiveClicked', { addressType });

              const params = new URLSearchParams({
                addressType,
                accId: activeAccount?.id ?? '',
              });
              history.push(`/receive?${params.toString()}`);
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
