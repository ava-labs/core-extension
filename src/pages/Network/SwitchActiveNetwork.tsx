import { useEffect } from 'react';
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
import { ActionStatus } from '@src/background/services/actions/models';
import { TokenIcon } from '@src/components/common/TokenImage';
import styled, { useTheme } from 'styled-components';
import { useApproveAction } from '../../hooks/useApproveAction';
import { Network } from '@avalabs/chains-sdk';
import { useTranslation } from 'react-i18next';

const SiteAvatar = styled(VerticalFlex)`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: 8px 0;
`;

export function SwitchActiveNetwork() {
  const { t } = useTranslation();
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
  }, [updateMessage, requestId, request]);

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

  const network: Network = request?.displayData;
  return (
    <>
      <VerticalFlex
        width="100%"
        padding="0 16px"
        align="center"
        justify="center"
      >
        <VerticalFlex
          align="center"
          margin="0 0 24px"
          flex={1}
          justify="center"
          width="280px"
        >
          <SiteAvatar margin="8px 0" justify="center" align="center">
            <TokenIcon height="48px" width="48px" src={network?.logoUri}>
              <GlobeIcon
                height="48px"
                width="48px"
                color={theme.colors.icon1}
              />
            </TokenIcon>
          </SiteAvatar>
          <HorizontalFlex align="center" width="100%" justify="center">
            <Typography
              as="h1"
              size={24}
              height="29px"
              weight={700}
              align="center"
              margin="0 0 16px"
            >
              {t('Switch to {{chainName}} Network?', {
                chainName: network?.chainName,
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
              {t(
                '{{domain}} is requesting to switch your active network to {{chainName}}',
                {
                  chainName: network?.chainName,
                  domain: request?.site?.domain || t('This website'),
                }
              )}
            </Typography>
          </HorizontalFlex>
        </VerticalFlex>
        <HorizontalFlex
          align="center"
          width="100%"
          justify="space-between"
          alignSelf="flex-end"
        >
          <SecondaryButton
            size={ComponentSize.LARGE}
            width="168px"
            onClick={() => {
              updateMessage({
                status: ActionStatus.ERROR_USER_CANCELED,
                id: request?.id,
              });
              window.close();
            }}
          >
            {t('Reject')}
          </SecondaryButton>
          <PrimaryButton
            width="168px"
            size={ComponentSize.LARGE}
            onClick={() => {
              updateMessage({
                status: ActionStatus.SUBMITTING,
                id: request?.id,
              });
            }}
          >
            {t('Approve')}
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </>
  );
}
