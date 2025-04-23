import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Typography } from '@avalabs/core-k2-components';
import {
  AlertType,
  SigningData_EthSendTx,
  SigningRequest,
} from '@avalabs/vm-module-types';

import { AlertBox } from 'packages/ui/pages/Permissions/components/AlertBox';
import { WarningBox } from 'packages/ui/pages/Permissions/components/WarningBox';
import { NetworkDetails } from 'packages/ui/pages/SignTransaction/components/ApprovalTxDetails';
import { SpendLimitInfo } from 'packages/ui/pages/SignTransaction/components/SpendLimitInfo/SpendLimitInfo';
import { TxBalanceChange } from 'packages/ui/pages/SignTransaction/components/TxBalanceChange';
import { NetworkWithCaipId } from '@core/service-worker';
import { FlexScrollbars } from 'packages/ui/src/components/common/FlexScrollbars';
import { MaliciousTxAlert } from 'packages/ui/src/components/common/MaliciousTxAlert';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from 'packages/ui/src/components/common/approval/ApprovalSection';
import { TransactionDetailItem } from 'packages/ui/src/components/common/approval/TransactionDetailItem';
import { useFeeCustomizer } from '../hooks/useFeeCustomizer';
import { MultiTxAction } from '@core/service-worker';
import { EnsureDefined } from '@core/service-worker';

export const TransactionDetailsCardContent = ({
  tx,
  handleRejection,
  network,
  action,
  index,
  setIndex,
  isFirst,
  isLast,
  hasEnoughForFee,
}: {
  tx: SigningRequest<SigningData_EthSendTx>;
  handleRejection: () => void;
  network?: NetworkWithCaipId;
  action: EnsureDefined<MultiTxAction, 'actionId'>;
  index: number;
  setIndex: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
  hasEnoughForFee: boolean;
}) => {
  const { t } = useTranslation();
  const { renderFeeWidget } = useFeeCustomizer({
    action,
    network,
    txIndex: index,
  });

  return (
    <>
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: 0.6,
        }}
      >
        {`#${index + 1}`}
      </Typography>
      <Stack
        sx={{
          width: 1,
          flexGrow: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: '100%',
            py: 2,
            px: 2,
            zIndex: 1,
            height: '56px',
          }}
        >
          <Typography variant="h4">{tx.displayData.title}</Typography>
        </Box>
        <FlexScrollbars>
          <Stack sx={{ flex: 1, width: 1, px: 2, gap: 2, pb: 3 }}>
            {tx.displayData.alert && (
              <Stack sx={{ width: 1, px: 2, mb: 1 }}>
                {tx.displayData.alert.type === AlertType.DANGER ? (
                  <>
                    <MaliciousTxAlert
                      showAlert
                      cancelHandler={handleRejection}
                      actionTitles={tx.displayData.alert.details.actionTitles}
                      title={tx.displayData.alert.details.title}
                      description={tx.displayData.alert.details.description}
                    />
                    <AlertBox
                      title={tx.displayData.alert.details.title}
                      text={tx.displayData.alert.details.description}
                    />
                  </>
                ) : (
                  <WarningBox
                    title={tx.displayData.alert.details.title}
                    text={tx.displayData.alert.details.description}
                  />
                )}
              </Stack>
            )}
            <Stack sx={{ width: '100%', gap: 2, pt: 1 }}>
              {tx.displayData.details.map((section, sectionIndex) => (
                <ApprovalSection key={`tx-detail-section-${sectionIndex}`}>
                  {section.title && (
                    <ApprovalSectionHeader label={section.title} />
                  )}
                  <ApprovalSectionBody sx={{ py: 1 }}>
                    {sectionIndex === 0 && network && (
                      <NetworkDetails network={network} />
                    )}
                    {section.items.map((item, itemIndex) => (
                      <TransactionDetailItem
                        key={`tx-detail.${sectionIndex}.${itemIndex}`}
                        item={item}
                      />
                    ))}
                  </ApprovalSectionBody>
                </ApprovalSection>
              ))}
              {tx.displayData.balanceChange && (
                <TxBalanceChange
                  ins={tx.displayData.balanceChange.ins}
                  outs={tx.displayData.balanceChange.outs}
                  isSimulationSuccessful={tx.displayData.isSimulationSuccessful}
                />
              )}
              {tx.displayData.tokenApprovals && (
                <SpendLimitInfo
                  {...tx.displayData.tokenApprovals}
                  actionId={action.actionId}
                />
              )}
              {tx.displayData.networkFeeSelector &&
                renderFeeWidget({
                  size: 'small',
                  isCollapsible: true,
                  hasEnoughForFee,
                })}
            </Stack>
          </Stack>
        </FlexScrollbars>
        <Stack
          sx={{
            width: 1,
            gap: 1,
            px: 2,
            pb: 2,
            pt: 1,
            flexDirection: 'row',
          }}
        >
          <Button
            size="medium"
            color="secondary"
            fullWidth
            onClick={() => {
              setIndex(index - 1);
            }}
            sx={{
              visibility: isFirst ? 'hidden' : 'visible',
            }}
          >
            {t('Previous')}
          </Button>
          <Button
            size="medium"
            color="primary"
            fullWidth
            onClick={() => {
              setIndex(index + 1);
            }}
            sx={{
              visibility: isLast ? 'hidden' : 'visible',
            }}
          >
            {t('Next')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
