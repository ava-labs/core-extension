import {
  Typography,
  VerticalFlex,
  GlobeIcon,
  HorizontalFlex,
  TextButton,
  ComponentSize,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { ApproveTransactionData } from '@src/contracts/contractParsers/models';
import { TransactionTabs } from './components/TransactionTabs';
import { truncateAddress } from '@src/utils/truncateAddress';
import { TransactionHeader } from './components/TransactionHeader';
import { TokenIcon } from '@src/components/common/TokenImage';
import { TransactionProgressData, TransactionProgressState } from './models';
import { SuccessFailTxInfo } from './components/SuccessFailTxInfo';

const SiteAvatar = styled(VerticalFlex)`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: 8px 0;
`;

export function ApproveTx({
  site,
  tokenToBeApproved,
  txParams,
  setShowCustomSpendLimit,
  displaySpendLimit,
  isRevokeApproval,
  gasPrice,
  gasLimit,
  onCustomFeeSet,
  transactionState,
  hash,
  error,
  ...rest
}: ApproveTransactionData & TransactionProgressData) {
  const theme = useTheme();

  const hideEdit: boolean =
    (isRevokeApproval && setShowCustomSpendLimit) ||
    (transactionState === TransactionProgressState.PENDING && !hash) ||
    transactionState === TransactionProgressState.SUCCESS;

  return (
    <VerticalFlex width="100%">
      <TransactionHeader
        title="Approval Summary"
        transactionState={transactionState}
        showNetwork={false}
      />

      <VerticalFlex align="center">
        <SiteAvatar justify="center" align="center">
          <TokenIcon height="48px" width="48px" src={site?.icon}>
            <GlobeIcon height="48px" width="48px" color={theme.colors.icon1} />
          </TokenIcon>
        </SiteAvatar>

        <Typography align="center" size={14} height="17px">
          Allow {site?.domain} to
          <br />
          spend your {tokenToBeApproved?.name || 'Unknown Token'}?
        </Typography>

        {/* Approval Amnt */}
        <VerticalFlex width="100%" margin="24px 0 0 0">
          <HorizontalFlex justify="space-between" align="center">
            <Typography size={12} height="15px">
              Approval amount
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
                {tokenToBeApproved?.symbol || 'Unknown Symbol'}
              </Typography>
            </Typography>
          </HorizontalFlex>

          {/* 
            Hides Edit button if its a Revoke approval or PENDING or SUCCESS
          */}

          {!hideEdit && (
            <HorizontalFlex>
              <TextButton
                onClick={() => setShowCustomSpendLimit(true)}
                size={ComponentSize.SMALL}
                height="16px"
              >
                Edit
              </TextButton>
            </HorizontalFlex>
          )}

          <HorizontalFlex justify="space-between" align="center">
            <Typography size={12} height="15px">
              To
            </Typography>
            <Typography weight={600} size={16} height="24px">
              {truncateAddress(rest.toAddress)}
            </Typography>
          </HorizontalFlex>
        </VerticalFlex>

        {/* Tabs */}
        {transactionState === TransactionProgressState.NOT_APPROVED ? (
          <TransactionTabs
            byteStr={txParams.data}
            gasPrice={gasPrice}
            limit={gasLimit?.toString() as string}
            onCustomFeeSet={onCustomFeeSet}
          />
        ) : (
          <SuccessFailTxInfo
            hash={hash}
            gasPrice={gasPrice}
            gasLimit={gasLimit?.toString() ?? ''}
            error={error}
          />
        )}
      </VerticalFlex>
    </VerticalFlex>
  );
}
