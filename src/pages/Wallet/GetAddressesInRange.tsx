import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  EyeIcon,
  EyeOffIcon,
  IconButton,
  Scrollbars,
  Stack,
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';

import { GetAddressesInRangeDisplayData } from '@src/background/services/accounts/models';
import { useApproveAction } from '@src/hooks/useApproveAction';
import { ActionStatus } from '@src/background/services/actions/models';
import { useGetRequestId } from '@src/hooks/useGetRequestId';
import {
  ApprovalSection,
  ApprovalSectionBody,
  ApprovalSectionHeader,
} from '@src/components/common/approval/ApprovalSection';
import { WebsiteDetails } from '../SignTransaction/components/ApprovalTxDetails';
import { DomainMetadata } from '@src/background/models';
import { TxDetailsRow } from '@src/components/common/approval/TxDetailsRow';
import { truncateAddress } from '@src/utils/truncateAddress';

export function GetAddressesInRange() {
  const { t } = useTranslation();
  const requestId = useGetRequestId();

  const { action, updateAction, cancelHandler } =
    useApproveAction<GetAddressesInRangeDisplayData>(requestId);

  if (!action) {
    return (
      <Stack
        sx={{
          width: 1,
          height: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Stack>
    );
  }

  const site: DomainMetadata = action.site ?? {
    domain: '#',
    name: t('Unknown website'),
  };

  const { addresses, indices } = action.displayData;

  return (
    <Stack sx={{ width: 1, px: 2, overflow: 'hidden' }}>
      <Stack sx={{ flexGrow: 1, width: 1, gap: 3 }}>
        <Typography variant="h4" sx={{ mt: 1.5 }}>
          {t('Expose addresses')}
        </Typography>

        <Scrollbars>
          <Stack sx={{ gap: 1.5 }}>
            <ApprovalSection>
              <ApprovalSectionHeader label={t('Action Details')} />
              <ApprovalSectionBody sx={{ py: 1, px: 2, gap: 1 }}>
                <WebsiteDetails site={site} />
                {indices.externalLimit > 0 && (
                  <TxDetailsRow label={t('Requested external indices')}>
                    <Typography variant="caption">
                      {t('From {{start}} to {{end}}', {
                        start: indices.externalStart,
                        end: indices.externalStart + indices.externalLimit,
                      })}
                    </Typography>
                  </TxDetailsRow>
                )}
                {indices.internalLimit > 0 && (
                  <TxDetailsRow label={t('Requested internal indices')}>
                    <Typography variant="caption">
                      {t('From {{start}} to {{end}}', {
                        start: indices.internalStart,
                        end: indices.internalStart + indices.internalLimit,
                      })}
                    </Typography>
                  </TxDetailsRow>
                )}
              </ApprovalSectionBody>
            </ApprovalSection>
            {addresses.external.length > 0 && (
              <AddressesSection
                label={t('External addresses')}
                addresses={addresses.external}
              />
            )}
            {addresses.internal.length > 0 && (
              <AddressesSection
                label={t('Internal addresses')}
                addresses={addresses.internal}
              />
            )}
          </Stack>
        </Scrollbars>
      </Stack>
      <Stack sx={{ width: 1, pt: 2, justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            color="secondary"
            size="large"
            data-testid="expose-addresses-reject-btn"
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            fullWidth
          >
            {t('Reject')}
          </Button>
          <Button
            data-testid="expose-addresses-approve-btn"
            size="large"
            color="primary"
            onClick={() => {
              updateAction({
                status: ActionStatus.SUBMITTING,
                id: requestId,
              });
            }}
            fullWidth
          >
            {t('Approve')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

const AddressesSection = ({
  label,
  addresses,
}: {
  label: string;
  addresses: string[];
}) => {
  const [hideAddresses, setHideAddresses] = useState(true);

  const shouldWrap = addresses.length > 5;

  return (
    <ApprovalSection>
      <ApprovalSectionHeader label={label}>
        <IconButton
          size="small"
          data-testid="show-addresses"
          onClick={() => setHideAddresses((v) => !v)}
        >
          {hideAddresses ? <EyeIcon /> : <EyeOffIcon />}
        </IconButton>
      </ApprovalSectionHeader>
      <ApprovalSectionBody
        sx={{
          py: 1.5,
          px: 2,
          flexDirection: shouldWrap ? 'row' : 'column',
          justifyContent: shouldWrap ? 'space-between' : 'initial',
          rowGap: 1.5,
          columnGap: 3,
          flexWrap: shouldWrap ? 'wrap' : 'nowrap',
        }}
      >
        {addresses.map((address) => (
          <AddressItem
            address={address}
            key={address}
            truncate={hideAddresses}
          />
        ))}
      </ApprovalSectionBody>
    </ApprovalSection>
  );
};

const AddressItem = ({
  address,
  truncate,
}: {
  address: string;
  truncate: boolean;
}) => {
  return (
    <Tooltip title={truncate ? address : ''} sx={{ flexBasis: '25%' }}>
      <Typography variant="caption">
        {truncate ? truncateAddress(address) : address}
      </Typography>
    </Tooltip>
  );
};
