import {
  Card,
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
import { ActionStatus } from '@src/background/services/actions/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useApproveAction } from '../../hooks/useApproveAction';
import { Network } from '@avalabs/chains-sdk';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';

const SiteAvatar = styled(VerticalFlex)`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: 24px 0;
`;

export function AddCustomNetworkPopup() {
  const theme = useTheme();
  const requestId = useGetRequestId();
  const { action: request, updateAction: updateMessage } =
    useApproveAction(requestId);

  useEffect(() => {
    function cancelHandler() {
      updateMessage({
        status: ActionStatus.ERROR_USER_CANCELED,
        id: requestId,
      });
    }
    window.addEventListener('unload', cancelHandler);

    return () => {
      window.removeEventListener('unload', cancelHandler);
    };
  }, [updateMessage, requestId]);

  if (!request || !request.displayData) {
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

  const customNetwork: Network = request.displayData;
  return (
    <>
      <VerticalFlex width="100%" padding="0 16px">
        <VerticalFlex padding="12px 0" align="flex-start">
          <Typography as="h1" size={24} height="29px" weight={700} align="left">
            Add New Network?
          </Typography>
        </VerticalFlex>

        <VerticalFlex align="center" margin="0 0 24px">
          <SiteAvatar justify="center" align="center">
            <TokenIcon height="48px" width="48px" src={customNetwork.logoUri}>
              <GlobeIcon
                height="48px"
                width="48px"
                color={theme.colors.icon1}
              />
            </TokenIcon>
          </SiteAvatar>

          <HorizontalFlex>
            <Typography
              size={18}
              height="2px"
              weight={700}
              color={theme.colors.text1}
              align="center"
              margin="0 0 8px"
            >
              {customNetwork.chainName}
            </Typography>
          </HorizontalFlex>
          <HorizontalFlex>
            <Typography
              size={14}
              height="17px"
              color={theme.colors.text2}
              align="center"
            >
              {request?.site?.domain}
            </Typography>
          </HorizontalFlex>
        </VerticalFlex>

        <Card height="250px" padding="16px">
          <Scrollbars>
            <VerticalFlex>
              <VerticalFlex marginBottom="16px">
                <Typography
                  size={14}
                  height="17px"
                  weight={400}
                  color={theme.colors.text1}
                >
                  Chain ID
                </Typography>

                <Typography
                  size={12}
                  height="15px"
                  weight={400}
                  color={theme.colors.text2}
                >
                  {customNetwork.chainId}
                </Typography>
              </VerticalFlex>
              <VerticalFlex marginBottom="16px">
                <Typography
                  size={14}
                  height="17px"
                  weight={400}
                  color={theme.colors.text1}
                >
                  Chain Name
                </Typography>

                <Typography
                  size={12}
                  height="15px"
                  weight={400}
                  color={theme.colors.text2}
                >
                  {customNetwork.chainName}
                </Typography>
              </VerticalFlex>
              <VerticalFlex marginBottom="16px">
                <Typography
                  size={14}
                  height="17px"
                  weight={400}
                  color={theme.colors.text1}
                >
                  RPC URL
                </Typography>

                <Typography
                  size={12}
                  height="15px"
                  weight={400}
                  color={theme.colors.text2}
                >
                  {customNetwork.rpcUrl}
                </Typography>
              </VerticalFlex>
              <VerticalFlex marginBottom="16px">
                <Typography
                  size={14}
                  height="17px"
                  weight={400}
                  color={theme.colors.text1}
                >
                  Explorer URL
                </Typography>

                <Typography
                  size={12}
                  height="15px"
                  weight={400}
                  color={theme.colors.text2}
                >
                  {customNetwork.explorerUrl}
                </Typography>
              </VerticalFlex>
              <VerticalFlex marginBottom="16px">
                <Typography
                  size={14}
                  height="17px"
                  weight={400}
                  color={theme.colors.text1}
                >
                  Network Symbol
                </Typography>

                <Typography
                  size={12}
                  height="15px"
                  weight={400}
                  color={theme.colors.text2}
                >
                  {customNetwork.networkToken.symbol}
                </Typography>
              </VerticalFlex>
              <VerticalFlex marginBottom="16px">
                <Typography
                  size={14}
                  height="17px"
                  weight={400}
                  color={theme.colors.text1}
                >
                  Token Name
                </Typography>

                <Typography
                  size={12}
                  height="15px"
                  weight={400}
                  color={theme.colors.text2}
                >
                  {customNetwork.networkToken.name}
                </Typography>
              </VerticalFlex>
              <VerticalFlex marginBottom="16px">
                <Typography
                  size={14}
                  height="17px"
                  weight={400}
                  color={theme.colors.text1}
                >
                  Token Decimals
                </Typography>

                <Typography
                  size={12}
                  height="15px"
                  weight={400}
                  color={theme.colors.text2}
                >
                  {customNetwork.networkToken.decimals}
                </Typography>
              </VerticalFlex>
            </VerticalFlex>
          </Scrollbars>
        </Card>
        <HorizontalFlex
          flex={1}
          align="flex-end"
          width="100%"
          justify="space-between"
          padding="0 0 8px"
        >
          <SecondaryButton
            size={ComponentSize.LARGE}
            width="168px"
            onClick={() => {
              updateMessage({
                status: ActionStatus.ERROR_USER_CANCELED,
                id: request.id,
              });
              window.close();
            }}
          >
            Reject
          </SecondaryButton>
          <PrimaryButton
            width="168px"
            size={ComponentSize.LARGE}
            onClick={() => {
              updateMessage({
                status: ActionStatus.SUBMITTING,
                id: request.id,
              });
            }}
          >
            Approve
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </>
  );
}
