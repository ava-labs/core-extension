export interface SwitchAccountParams {
  accountId: string;
}

export interface SwitchAccountDeps {
  selectAccount: (accountId: string) => Promise<void>;
}

export const createSwitchAccountFunction = ({
  selectAccount,
}: SwitchAccountDeps) => {
  return async ({ accountId }: SwitchAccountParams) => {
    await selectAccount(accountId);

    return {
      content: `Success! The new active account is ${accountId}`,
    };
  };
};
