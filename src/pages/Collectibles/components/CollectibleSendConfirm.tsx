import {
  VerticalFlex,
  Typography,
  PrimaryButton,
  ComponentSize,
  Card,
  HorizontalFlex,
  SecondaryButton,
  HorizontalSeparator,
  Tooltip,
  SubTextTypography,
} from '@avalabs/react-components';
import styled from 'styled-components';
import { Contact } from '@src/background/services/contacts/models';
import { SendNftState } from '@avalabs/wallet-react-components';
import { truncateAddress } from '@src/utils/truncateAddress';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useHistory } from 'react-router-dom';
import { CustomFees, GasFeeModifier } from '@src/components/common/CustomFees';
import { TransactionFeeTooltip } from '@src/components/common/TransactionFeeTooltip';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';
import { CollectibleMedia } from './CollectibleMedia';
import { useLedgerDisconnectedDialog } from '@src/pages/SignTransaction/hooks/useLedgerDisconnectedDialog';
import { SendStateWithActions } from '@src/pages/Send/models';
import { NFT } from '@avalabs/blizzard-sdk';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { BigNumber } from 'ethers';

const StyledCollectibleMedia = styled(CollectibleMedia)`
  position: absolute;
  top: -36px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: fit-content;
  border: 8px solid ${({ theme }) => theme.colors.bg1};
  border-radius: 8px;
`;

const CardLabel = styled(Typography)`
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme }) => theme.colors.text2};
`;

const ContactName = styled(Typography)`
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 14px;
  line-height: 17px;
`;

const ContactAddress = styled(Typography)`
  text-align: right;
  margin-top: 2px;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.text2};
`;

type CollectibleSendConfirmProps = {
  sendState: SendStateWithActions & SendNftState;
  contact: Contact;
  nft: NFT;
  tokenId: string;
  onSubmit(): void;
  onGasChanged(
    gasLimit: number,
    gasPrice: BigNumber,
    feeType: GasFeeModifier
  ): void;
  maxGasPrice?: string;
  gasPrice?: BigNumber;
  selectedGasFee?: GasFeeModifier;
};

export const CollectibleSendConfirm = ({
  sendState,
  contact,
  nft,
  tokenId,
  onSubmit,
  onGasChanged,
  maxGasPrice,
  gasPrice,
  selectedGasFee,
}: CollectibleSendConfirmProps) => {
  const history = useHistory();
  const { activeAccount } = useAccountsContext();
  const { networkFee } = useNetworkFeeContext();

  useLedgerDisconnectedDialog(() => {
    history.goBack();
  });

  const nftItem = nft.nftData.find((data) => data.tokenId === tokenId);

  if (!activeAccount || !nftItem) {
    history.push('/home');
    return null;
  }

  return (
    <>
      <VerticalFlex height="100%" width="100%">
        <PageTitle variant={PageTitleVariant.PRIMARY}>
          Confirm Transaction
        </PageTitle>
        <VerticalFlex
          grow="1"
          align="center"
          width="100%"
          padding="0 16px 24px 16px"
        >
          <Card
            position="relative"
            margin="44px 0 0 0"
            padding="44px 16px 16px"
          >
            <StyledCollectibleMedia
              width="auto"
              height="56px"
              url={nftItem.externalData.imageSmall}
            />
            <VerticalFlex width="100%" align="center">
              <SubTextTypography size={14} height="17px">
                Collectible
              </SubTextTypography>
              <Typography
                size={18}
                height="22px"
                weight={700}
                margin="4px 0"
              >{`#${tokenId}`}</Typography>
              <SubTextTypography size={16} height="24px" weight={600}>
                {nftItem?.externalData.name}
              </SubTextTypography>
              <HorizontalFlex
                margin="16px 0 0"
                justify="space-between"
                width="100%"
              >
                <CardLabel>From</CardLabel>
                <VerticalFlex>
                  <ContactName>{activeAccount.name}</ContactName>
                  <ContactAddress>
                    {truncateAddress(activeAccount.addressC || '')}
                  </ContactAddress>
                </VerticalFlex>
              </HorizontalFlex>
              <HorizontalSeparator margin="8px 0" />
              <HorizontalFlex justify="space-between" width="100%">
                <CardLabel>To</CardLabel>
                <VerticalFlex>
                  <ContactName>{contact?.name}</ContactName>
                  <ContactAddress>
                    {truncateAddress(contact?.address || '')}
                  </ContactAddress>
                </VerticalFlex>
              </HorizontalFlex>
            </VerticalFlex>
          </Card>

          <HorizontalFlex margin="16px 0 8px" width="100%" align="center">
            <Typography size={12} height="15px" margin="0 8px 0 0">
              Network Fee
            </Typography>
            <TransactionFeeTooltip
              gasPrice={BigNumber.from(sendState?.gasPrice?.toString() || 0)}
              gasLimit={sendState?.gasLimit}
            />
          </HorizontalFlex>
          <VerticalFlex width="100%">
            <CustomFees
              gasPrice={gasPrice || networkFee?.low || BigNumber.from(0)}
              limit={sendState?.gasLimit || 0}
              onChange={onGasChanged}
              maxGasPrice={maxGasPrice}
              selectedGasFeeModifier={selectedGasFee}
            />
          </VerticalFlex>

          <VerticalFlex align="center" justify="flex-end" width="100%" grow="1">
            <HorizontalFlex width="100%" justify="space-between" align="center">
              <SecondaryButton
                width="168px"
                size={ComponentSize.LARGE}
                onClick={() => history.goBack()}
              >
                Cancel
              </SecondaryButton>
              <Tooltip
                content={
                  <Typography size={14}>{sendState?.error?.message}</Typography>
                }
                disabled={!sendState?.error?.error}
              >
                <PrimaryButton
                  width="168px"
                  size={ComponentSize.LARGE}
                  onClick={onSubmit}
                  disabled={!sendState?.canSubmit}
                >
                  Send Now
                </PrimaryButton>
              </Tooltip>
            </HorizontalFlex>
          </VerticalFlex>
        </VerticalFlex>
      </VerticalFlex>
    </>
  );
};
