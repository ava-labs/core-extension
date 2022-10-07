import {
  Typography,
  VerticalFlex,
  GlobeIcon,
  HorizontalFlex,
  TextButton,
  ComponentSize,
} from '@avalabs/react-components';
import { useTheme } from 'styled-components';
import { ApproveTransactionData } from '@src/contracts/contractParsers/models';
import { truncateAddress } from '@src/utils/truncateAddress';
import { TransactionHeader } from './components/TransactionHeader';
import { TokenIcon } from '@src/components/common/TokenImage';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

export function ApproveTx({
  site,
  tokenToBeApproved,
  setShowCustomSpendLimit,
  displaySpendLimit,
  ...rest
}: ApproveTransactionData) {
  const theme = useTheme();

  const hideEdit: boolean =
    displaySpendLimit === '0' && setShowCustomSpendLimit;

  return (
    <VerticalFlex width="100%">
      <TransactionHeader title="Approval Summary" showNetwork={false} />

      <VerticalFlex align="center">
        <SiteAvatar justify="center" align="center">
          <TokenIcon height="48px" width="48px" src={site?.icon}>
            <GlobeIcon height="48px" width="48px" color={theme.colors.icon1} />
          </TokenIcon>
        </SiteAvatar>

        <Typography align="center" size={14} height="17px">
          <Trans
            i18nKey="Allow {{domain}} to <br /> spend your {{name}}?"
            domain={site?.domain}
            name={tokenToBeApproved?.name || 'Unknown Token'}
          />
        </Typography>

        {/* Approval Amnt */}
        <VerticalFlex width="100%" margin="24px 0 0 0">
          <HorizontalFlex justify="space-between" align="center">
            <Typography size={12} height="15px">
              {t('Approval amount')}
            </Typography>
            <Typography weight={700} size={18} height="22px">
              {displaySpendLimit}
              <Typography
                padding="0 0 0 4px"
                weight={600}
                size={16}
                height="24px"
                color={theme.colors.text2}
              >
                {tokenToBeApproved?.symbol || t('Unknown Symbol')}
              </Typography>
            </Typography>
          </HorizontalFlex>

          {/* 
            Hides Edit button if its a Revoke approval
          */}

          {!hideEdit && (
            <HorizontalFlex>
              <TextButton
                onClick={() => setShowCustomSpendLimit(true)}
                size={ComponentSize.SMALL}
                height="16px"
              >
                {t('Edit')}
              </TextButton>
            </HorizontalFlex>
          )}

          <HorizontalFlex justify="space-between" align="center">
            <Typography size={12} height="15px">
              {t('To')}
            </Typography>
            <Typography weight={600} size={16} height="24px">
              {truncateAddress(rest.toAddress || '')}
            </Typography>
          </HorizontalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
