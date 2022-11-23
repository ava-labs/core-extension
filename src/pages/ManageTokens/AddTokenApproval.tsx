import { NetworkContractToken } from '@avalabs/chains-sdk';
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
import { ActionStatus } from '@src/background/services/actions/models';
import { SiteAvatar } from '@src/components/common/SiteAvatar';
import { TokenIcon } from '@src/components/common/TokenImage';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

export function AddTokenApproval() {
  const { t } = useTranslation();
  const theme = useTheme();
  const requestId = useGetRequestId();
  const {
    action: request,
    updateAction: updateMessage,
    cancelHandler,
  } = useApproveAction(requestId);

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

  const customToken: NetworkContractToken = request.displayData;

  return (
    <>
      <VerticalFlex width="100%" padding="0 16px">
        <VerticalFlex padding="12px 0" align="flex-start">
          <Typography as="h1" size={24} height="29px" weight={700} align="left">
            {t('Add New Asset?')}
          </Typography>
        </VerticalFlex>

        <VerticalFlex align="center" margin="0 0 24px">
          <SiteAvatar justify="center" align="center">
            <TokenIcon height="48px" width="48px" src={customToken.logoUri}>
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
              {customToken.name}
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

        <Card height="260px" padding="16px">
          <VerticalFlex>
            <VerticalFlex marginBottom="16px">
              <Typography
                size={14}
                height="17px"
                weight={400}
                color={theme.colors.text1}
              >
                {t('Name')}
              </Typography>

              <Typography
                size={12}
                height="15px"
                weight={400}
                color={theme.colors.text2}
              >
                {customToken.name}
              </Typography>
            </VerticalFlex>
            <VerticalFlex marginBottom="16px">
              <Typography
                size={14}
                height="17px"
                weight={400}
                color={theme.colors.text1}
              >
                {t('Symbol')}
              </Typography>

              <Typography
                size={12}
                height="15px"
                weight={400}
                color={theme.colors.text2}
              >
                {customToken.symbol}
              </Typography>
            </VerticalFlex>
            <VerticalFlex marginBottom="16px">
              <Typography
                size={14}
                height="17px"
                weight={400}
                color={theme.colors.text1}
              >
                {t('Address')}
              </Typography>

              <Typography
                size={12}
                height="15px"
                weight={400}
                color={theme.colors.text2}
              >
                {customToken.address}
              </Typography>
            </VerticalFlex>
            <VerticalFlex marginBottom="16px">
              <Typography
                size={14}
                height="17px"
                weight={400}
                color={theme.colors.text1}
              >
                {t('Decimals')}
              </Typography>

              <Typography
                size={12}
                height="15px"
                weight={400}
                color={theme.colors.text2}
              >
                {customToken.decimals}
              </Typography>
            </VerticalFlex>
            <VerticalFlex marginBottom="16px">
              <Typography
                size={14}
                height="17px"
                weight={400}
                color={theme.colors.text1}
              >
                {t('Contract Type')}
              </Typography>

              <Typography
                size={12}
                height="15px"
                weight={400}
                color={theme.colors.text2}
              >
                {customToken.contractType}
              </Typography>
            </VerticalFlex>
          </VerticalFlex>
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
              cancelHandler();
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
                id: request.id,
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
