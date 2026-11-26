import { ChevronRightIcon, IconButton } from '@avalabs/k2-alpine';

type TransferProgressLinkProps = {
  transferId: string;
  onOpen: () => void;
};

export const TransferProgressLink = ({
  transferId,
  onOpen,
}: TransferProgressLinkProps) => (
  <IconButton
    data-testid="show-transfer-progress-button"
    data-transfer-id={transferId}
    size="small"
    sx={{ color: 'background.default', padding: 0 }}
    onClick={onOpen}
  >
    <ChevronRightIcon size={18} />
  </IconButton>
);
