import {
  ComponentSize,
  HorizontalFlex,
  LoadingSpinnerIcon,
  PrimaryAddress,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
  WalletIcon,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { Account } from '@src/background/services/accounts/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { Action, ActionStatus } from '@src/background/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useTranslation } from 'react-i18next';

const SiteAvatar = styled(VerticalFlex)`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: 8px 0;
`;

export function SwitchAccount() {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();

  const {
    action,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction(requestId);

  const request = action as Action & { selectedAccount: Account };

  if (!request) {
    return (
      <HorizontalFlex
        width={'100%'}
        height={'100%'}
        justify={'center'}
        align={'center'}
      >
        <LoadingSpinnerIcon color={theme.colors.icon1} />
      </HorizontalFlex>
    );
  }

  return (
    <VerticalFlex padding="0 16px">
      <VerticalFlex grow="1" align="center" justify="center">
        <SiteAvatar justify="center" align="center">
          <WalletIcon height="48px" width="48px" color={theme.colors.icon1} />
        </SiteAvatar>
        <HorizontalFlex align="center" width="100%" justify="center">
          <Typography
            align="center"
            size={24}
            margin="16px 0"
            height="29px"
            weight={700}
          >
            {t('Switch to {{name}}?', {
              name: request.selectedAccount?.name,
            })}
          </Typography>
        </HorizontalFlex>
        <HorizontalFlex>
          <Typography
            size={14}
            height="17px"
            color={theme.colors.text2}
            align="center"
          >
            {t('{{domain}} is requesting to switch your active account.', {
              domain: request.site?.domain || 'This website',
            })}
          </Typography>
        </HorizontalFlex>

        <HorizontalFlex marginTop="16px">
          <PrimaryAddress
            name={request.selectedAccount?.name}
            address={request.selectedAccount?.addressC}
          />
        </HorizontalFlex>
      </VerticalFlex>

      <VerticalFlex width="100%" justify="space-between">
        <HorizontalFlex justify="space-between">
          <SecondaryButton
            data-testid="switch-account-reject-btn"
            size={ComponentSize.LARGE}
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            width="168px"
          >
            {t('Reject')}
          </SecondaryButton>
          <PrimaryButton
            data-testid="switch-account-approve-btn"
            size={ComponentSize.LARGE}
            onClick={() => {
              updateMessage({
                status: ActionStatus.SUBMITTING,
                id: request.id,
              });

              window.close();
            }}
            width="168px"
          >
            {t('Approve')}
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
