// Helper to measure text width
export const measureTextWidth = (text: string): number => {
  const temp = document.createElement('div');
  temp.style.cssText =
    'position:absolute;visibility:hidden;white-space:nowrap;font-size:14px';
  temp.textContent = text;
  document.body.appendChild(temp);
  const width = temp.offsetWidth;
  document.body.removeChild(temp);
  return width;
};

// Layout constants
const CONTAINER_WIDTH = 128;
const NAVIGATE_ICON_WIDTH = 20;
const WALLET_ICON_WIDTH = 24; // Minimum width for icon + space for label
const GAP = 4;

// Layout state for wallet display
type WalletLayout = {
  showIcon: boolean;
  shouldTruncate: boolean;
  isTruncated: boolean;
  maxWidth: number | undefined;
};

// Calculate wallet layout based on available space
export const calculateWalletLayout = (
  walletNameWidth: number,
  accountNameWidth: number,
): WalletLayout => {
  const totalNeeded =
    walletNameWidth + GAP + NAVIGATE_ICON_WIDTH + GAP + accountNameWidth;

  // Scenario 1: Everything fits
  if (totalNeeded <= CONTAINER_WIDTH) {
    return {
      showIcon: false,
      shouldTruncate: false,
      isTruncated: false,
      maxWidth: undefined,
    };
  }

  // Scenario 2: Need to truncate wallet
  const spaceForAccount = accountNameWidth + GAP + NAVIGATE_ICON_WIDTH + GAP;
  const spaceForWallet = CONTAINER_WIDTH - spaceForAccount;

  // Scenario 3: Show icon if wallet would be too narrow
  if (spaceForWallet < WALLET_ICON_WIDTH) {
    return {
      showIcon: true,
      shouldTruncate: false,
      isTruncated: false,
      maxWidth: undefined,
    };
  }

  // Scenario 4: Truncate wallet name
  return {
    showIcon: false,
    shouldTruncate: true,
    isTruncated: walletNameWidth > spaceForWallet,
    maxWidth: spaceForWallet,
  };
};
