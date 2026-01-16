import { Fade, SquareButton, Stack } from '@avalabs/k2-alpine';
import { useHistory } from 'react-router-dom';
import { useAnalyticsContext } from '@core/ui';

import { getFusionPath, getSendPath } from '@/config/routes';
import { FunctionNames, useIsFunctionAvailable } from '@core/ui';
import { getCoreWebUrl } from '@core/common/src/utils/getCoreWebUrl';
import { openNewTab } from '@core/common/src/utils/extensionUtils';
import { useTranslation } from 'react-i18next';
import { SendIcon } from '@/components/SendIcon';
import { BuyIcon } from '@/components/BuyIcon';
import {
  FungibleTokenBalance,
  getUniqueTokenId,
  NetworkWithCaipId,
} from '@core/types';
import { FaExplosion } from 'react-icons/fa6';

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
  const isBuySupported = checkIsFunctionSupported(FunctionNames.BUY);
  const tokenId = token ? getUniqueTokenId(token) : '';

  let delay = 0;
  const getDelay = () => (delay += 300);

  return (
    <Stack direction="row" gap={1} width="100%">
      <Fade in timeout={getDelay()} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<FaExplosion size={ICON_SIZE} />}
          label={t('Fusion')}
          onClick={() => {
            capture('FusionClicked'); //
            push(getFusionPath({ from: tokenId }));
          }}
        />
      </Fade>

      <Fade in timeout={getDelay()} easing="ease-out">
        <SquareButton
          variant="extension"
          icon={<SendIcon size={ICON_SIZE} />}
          label={t('Send')}
          onClick={() => {
            capture('TokenSendClicked');
            push(getSendPath({ token: tokenId }));
          }}
        />
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
    </Stack>
  );
};
