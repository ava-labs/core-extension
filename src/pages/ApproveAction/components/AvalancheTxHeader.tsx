import { Box, Typography } from '@avalabs/k2-components';
import {
  AvalancheTx,
  AvalancheTxType,
} from '@src/background/services/wallet/models';
import { useTranslation } from 'react-i18next';

type AvalancheTxHeaderProps = {
  tx: AvalancheTx;
};

const useAvalancheTxHeader = (tx: AvalancheTx) => {
  const { t } = useTranslation();

  switch (tx.type) {
    case AvalancheTxType.AddValidator:
      return t('Add Validator');

    case AvalancheTxType.AddDelegator:
      return t('Add Delegator');

    case AvalancheTxType.AddSubnetValidator:
      return t('Add Subnet Validator');

    case AvalancheTxType.CreateChain:
      return t('Create Blockchain');

    case AvalancheTxType.CreateSubnet:
      return t('Create Subnet');

    case AvalancheTxType.Export:
      return t('Approve Export');

    case AvalancheTxType.Import:
      return t('Approve Import');

    case AvalancheTxType.Base:
      return t('Approve Transaction');

    default:
      return t('Unknown Transaction');
  }
};

export const AvalancheTxHeader: React.FC<AvalancheTxHeaderProps> = ({ tx }) => {
  const header = useAvalancheTxHeader(tx);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.default',
        py: 1.5,
        mb: 2,
        zIndex: 1,
        height: '56px',
      }}
    >
      <Typography component="h1" variant="h3">
        {header}
      </Typography>
    </Box>
  );
};
