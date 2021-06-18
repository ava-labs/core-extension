export function accountsChangedUpdate(accounts: string[]) {
  return {
    method: "metamask_accountsChanged",
    params: {
      accounts,
    },
  };
}

export function unlockStateChangedUpdate(
  isUnlocked: boolean,
  accounts: string[]
) {
  return {
    method: "metamask_unlockStateChanged",
    params: {
      isUnlocked,
      ...(isUnlocked ? { accounts } : {}),
    },
  };
}

export function chainChangedUpdate(chainId: string) {
  return {
    method: "metamask_chainChanged",
    params: {
      chainId,
      networkVersion: "avax",
    },
  };
}
