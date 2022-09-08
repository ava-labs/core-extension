import {
  ComponentSize,
  GlobeIcon,
  HorizontalFlex,
  LoadingSpinnerIcon,
  PrimaryButton,
  SecondaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { Action, ActionStatus } from '@src/background/services/actions/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import styled, { useTheme } from 'styled-components';
import { Network } from '@avalabs/chains-sdk';
import { useApproveAction } from '../../hooks/useApproveAction';

const SiteAvatar = styled(VerticalFlex)`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: 8px 0;
`;

export function SetDeveloperMode() {
  const theme = useTheme();
  const requestId = useGetRequestId();

  const {
    action,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction(requestId);

  const request = action as Action;

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

  const network: Network = request?.displayData;
  return (
    <VerticalFlex>
      <VerticalFlex grow="1" align="center" justify="center">
        <SiteAvatar margin="8px 0" justify="center" align="center">
          <TokenIcon height="48px" width="48px" src={network?.logoUri}>
            <GlobeIcon height="48px" width="48px" color={theme.colors.icon1} />
          </TokenIcon>
        </SiteAvatar>
        <HorizontalFlex align="center" width="100%" justify="center">
          <Typography
            align="center"
            size={24}
            margin="16px 0"
            height="29px"
            weight={700}
          >
            {request?.displayData?.isTestmode ? 'Activate' : 'Deactivate'}{' '}
            Testnet Mode?
          </Typography>
        </HorizontalFlex>
        <HorizontalFlex>
          <Typography
            size={14}
            height="17px"
            color={theme.colors.text2}
            align="center"
          >
            {request?.site?.domain || 'This website'} is requesting to turn
            Testnet Mode {request?.displayData?.isTestmode ? 'ON' : 'OFF'}.
          </Typography>
        </HorizontalFlex>
      </VerticalFlex>

      <VerticalFlex width="100%" justify="space-between">
        <HorizontalFlex justify="space-between" gap="16px">
          <SecondaryButton
            size={ComponentSize.LARGE}
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            width="168px"
          >
            Reject
          </SecondaryButton>
          <PrimaryButton
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
            Approve
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
