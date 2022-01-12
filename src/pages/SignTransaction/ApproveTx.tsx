import {
  Typography,
  VerticalFlex,
  TokenImg,
  GlobeIcon,
  HorizontalFlex,
  TextButton,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { ApproveTransactionData } from '@src/contracts/contractParsers/models';
import { TransactionTabs } from './components/TransactionTabs';
import { truncateAddress } from '@src/utils/truncateAddress';

const SiteAvatar = styled(VerticalFlex)<{ margin: string }>`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '0px'};
`;

export function ApproveTx({
  site,
  tokenToBeApproved,
  fee,
  feeUSD,
  txParams,
  setShowCustomFees,
  setShowCustomSpendLimit,
  displaySpendLimit,
  isRevokeApproval,
  ...rest
}: ApproveTransactionData) {
  const theme = useTheme();

  return (
    <VerticalFlex width={'100%'} align={'center'} margin="24px 0 0 0">
      <Typography as="h1" size={24} weight={700} margin="0 0 32px 0">
        Approval Summary
      </Typography>
      <SiteAvatar justify="center" align="center" margin="0 0 8px 0">
        {site.icon ? (
          <TokenImg height="48px" width="48px" src={site?.icon} />
        ) : (
          <GlobeIcon height="48px" color={theme.colors.icon1} />
        )}
      </SiteAvatar>
      <Typography align="center" height="24px">
        Allow {site?.domain} to spend your{' '}
        {tokenToBeApproved?.name || 'Unknown Token'}
      </Typography>

      {/* Tabs */}
      <TransactionTabs
        fee={fee}
        feeUSD={feeUSD}
        setShowCustomFees={setShowCustomFees}
        byteStr={txParams.data}
      >
        <VerticalFlex>
          {/* Bottom Approval Amnt */}
          <HorizontalFlex justify="space-between">
            <Typography padding="0 0 4px 0" height="24px" weight={600}>
              Approval amount
            </Typography>
            <Typography padding="0 0 4px 0" weight={600} height="24px">
              {displaySpendLimit}
              <Typography
                padding="0 0 0 4px"
                weight={600}
                color={theme.colors.text2}
              >
                {tokenToBeApproved?.symbol || 'Unknown Symbol'}
              </Typography>
            </Typography>
          </HorizontalFlex>

          <HorizontalFlex justify="space-between" margin="8px 0 0 0">
            <Typography padding="0 0 4px 0" height="24px" weight={600}>
              To
            </Typography>
            <Typography padding="0 0 4px 0" weight={600} height="24px">
              {truncateAddress(rest.toAddress)}
            </Typography>
          </HorizontalFlex>
          {/* Hides Edit button if its a Revoke approval */}
          {!isRevokeApproval && setShowCustomSpendLimit && (
            <HorizontalFlex>
              <TextButton onClick={() => setShowCustomSpendLimit(true)}>
                <Typography
                  size={12}
                  color={theme.colors.primary1}
                  weight={600}
                >
                  Edit
                </Typography>
              </TextButton>
            </HorizontalFlex>
          )}
        </VerticalFlex>
      </TransactionTabs>
    </VerticalFlex>
  );
}
