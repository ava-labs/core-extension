import { Menu, MenuItem } from '@mui/material';

const WalletContextMenu = ({
  anchorEl,
  open,
  onClose,
}: {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}) => (
  <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
    <MenuItem onClick={onClose}>Option 1</MenuItem>
    <MenuItem onClick={onClose}>Option 2</MenuItem>
  </Menu>
);

export default WalletContextMenu;
