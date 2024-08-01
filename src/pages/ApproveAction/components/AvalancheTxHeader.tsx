import { Box, Typography } from '@avalabs/core-k2-components';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { useTranslation } from 'react-i18next';

type AvalancheTxHeaderProps = {
  tx: Avalanche.Tx;
};

const useAvalancheTxHeader = (tx: Avalanche.Tx) => {
  const { t } = useTranslation();

  switch (tx.type) {
    case Avalanche.TxType.AddPermissionlessValidator:
    case Avalanche.TxType.AddValidator:
      return t('Add Validator');

    case Avalanche.TxType.AddPermissionlessDelegator:
    case Avalanche.TxType.AddDelegator:
      return t('Add Delegator');

    case Avalanche.TxType.AddSubnetValidator:
      return t('Add Subnet Validator');

    case Avalanche.TxType.RemoveSubnetValidator:
      return t('Remove Subnet Validator');

    case Avalanche.TxType.CreateChain:
      return t('Create Blockchain');

    case Avalanche.TxType.CreateSubnet:
      return t('Create Subnet');

    case Avalanche.TxType.Export:
      return t('Approve Export');

    case Avalanche.TxType.Import:
      return t('Approve Import');

    case Avalanche.TxType.Base:
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
        py: 1.5,
        mb: 2,
        zIndex: 1,
        height: '56px',
      }}
    >
      <Typography variant="h4" component="h1">
        {header}
      </Typography>
    </Box>
  );
};
