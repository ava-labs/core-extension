import {
  Alert,
  AlertTitle,
  AlertTriangleIcon,
  Divider,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import {
  TransactionTokenCard,
  TransactionTokenCardVariant,
} from './TransactionTokenCard';
import { TokenIcon } from '@src/components/common/TokenIcon';
import { CollectibleMedia } from '@src/pages/Collectibles/components/CollectibleMedia';
import { Action } from '@src/background/services/actions/models';
import { Transaction } from '@src/background/services/wallet/handlers/eth_sendTransaction/models';
import { NftAccordion } from './NftAccordion';

type TxBalanceChangeProps = {
  transaction: Action<Transaction>;
};

export const TxBalanceChange = ({ transaction }: TxBalanceChangeProps) => {
  const { t } = useTranslation();
  const balanceChange = transaction.displayData?.displayValues?.balanceChange;

  const hasSentItems =
    (balanceChange?.sendTokenList.length ?? 0) > 0 ||
    (balanceChange?.sendNftList.length ?? 0) > 0;

  const hasReceivedItems =
    (balanceChange?.receiveTokenList.length ?? 0) > 0 ||
    (balanceChange?.receiveNftList.length ?? 0) > 0;

  const showNonPreExecInfoWarning =
    (hasSentItems || hasReceivedItems) &&
    !transaction.displayData?.displayValues?.preExecSuccess;

  const showNoDataWarning =
    !hasSentItems &&
    !hasReceivedItems &&
    !transaction.displayData?.displayValues?.preExecSuccess;

  const hasReceiveNftList =
    balanceChange && balanceChange?.receiveNftList.length > 1;

  const hasReceiveNftCollection = balanceChange?.receiveNftList[0]?.size;

  const hasSendNftList = balanceChange && balanceChange?.sendNftList.length > 1;
  const hasSendNftCollection = balanceChange?.sendNftList[0]?.size;

  if (
    !hasSentItems &&
    !hasReceivedItems &&
    !showNonPreExecInfoWarning &&
    !showNoDataWarning &&
    !hasReceiveNftCollection &&
    !hasReceiveNftList &&
    !hasSendNftList &&
    !hasSendNftCollection &&
    !transaction.displayData?.displayValues?.abi
  ) {
    return null;
  }
  return (
    <ApprovalSection>
      <ApprovalSectionHeader
        label={t('Balance Change')}
        tooltip={
          showNonPreExecInfoWarning
            ? t(
                'Transaction pre-exution is unavailable. The displayed token list might be incomplete.'
              )
            : undefined
        }
        tooltipIcon={
          showNonPreExecInfoWarning ? (
            <AlertTriangleIcon
              sx={{ color: 'warning.main', cursor: 'pointer' }}
            />
          ) : undefined
        }
      />
      <ApprovalSectionBody>
        <Stack gap={2}>
          {transaction.displayData?.displayValues?.abi && (
            <>
              <TxDetailsRow label={t('Transaction Type')}>
                <Typography variant="caption">
                  {transaction.displayData.displayValues.abi.func}
                </Typography>
              </TxDetailsRow>
              {(hasReceivedItems || hasSentItems) && <Divider />}
            </>
          )}
          {balanceChange?.sendTokenList.map((token, index) => (
            <TransactionTokenCard
              key={`s-token-${token.symbol}-${index}`}
              token={token}
              variant={TransactionTokenCardVariant.SEND}
              sx={{ p: 0 }}
            >
              <TokenIcon
                width="32px"
                height="32px"
                src={token.logoUri}
                name={token.name}
              />
            </TransactionTokenCard>
          ))}
          {balanceChange?.sendNftList.map((nft, index) => (
            <>
              {nft.size && index === 0 && (
                <TransactionTokenCard
                  key={`s-nft-${nft.address}-${index}`}
                  token={nft}
                  variant={TransactionTokenCardVariant.SEND}
                  sx={{ p: 0 }}
                >
                  <CollectibleMedia
                    height="32px"
                    width="auto"
                    maxWidth="32px"
                    url={nft?.logoUri}
                    hover={false}
                    margin="8px 0"
                    showPlayIcon={false}
                  />
                </TransactionTokenCard>
              )}
            </>
          ))}
          {balanceChange?.receiveTokenList.map((token, index) => (
            <TransactionTokenCard
              key={`r-token-${token.symbol}-${index}`}
              token={token}
              variant={TransactionTokenCardVariant.RECEIVE}
              sx={{ p: 0 }}
            >
              <TokenIcon
                width="32px"
                height="32px"
                src={token.logoUri}
                name={token.name}
              />
            </TransactionTokenCard>
          ))}
          {hasReceiveNftList && hasReceiveNftCollection && (
            <NftAccordion nftList={balanceChange?.receiveNftList} />
          )}
          {hasSendNftList && hasSendNftCollection && (
            <NftAccordion nftList={balanceChange?.sendNftList} />
          )}
          {!hasReceiveNftCollection &&
            balanceChange?.receiveNftList.map((nft, index) => {
              return (
                <>
                  <TransactionTokenCard
                    key={`r-nft-${nft.address}-${index}`}
                    token={nft}
                    variant={TransactionTokenCardVariant.RECEIVE}
                    sx={{ p: 0 }}
                  >
                    <CollectibleMedia
                      height="32px"
                      width="auto"
                      maxWidth="32px"
                      url={nft?.logoUri}
                      hover={false}
                      margin="8px 0"
                      showPlayIcon={false}
                    />
                  </TransactionTokenCard>
                </>
              );
            })}

          {!hasSendNftCollection &&
            balanceChange?.sendNftList.map((nft, index) => {
              return (
                <>
                  <TransactionTokenCard
                    key={`r-nft-${nft.address}-${index}`}
                    token={nft}
                    variant={TransactionTokenCardVariant.RECEIVE}
                    sx={{ p: 0 }}
                  >
                    <CollectibleMedia
                      height="32px"
                      width="auto"
                      maxWidth="32px"
                      url={nft?.logoUri}
                      hover={false}
                      margin="8px 0"
                      showPlayIcon={false}
                    />
                  </TransactionTokenCard>
                </>
              );
            })}

          {showNoDataWarning && (
            <Alert severity="info">
              <AlertTitle>{t('Balance change info not available')}</AlertTitle>
              {t('Please proceed with caution')}
            </Alert>
          )}
        </Stack>
      </ApprovalSectionBody>
    </ApprovalSection>
  );
};
