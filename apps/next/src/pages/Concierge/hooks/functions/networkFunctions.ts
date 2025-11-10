export interface EnableNetworkParams {
  chainId: number;
}

export interface DisableNetworkParams {
  chainId: number;
}

export interface NetworkFunctionsDeps {
  enableNetwork: (chainId: number) => void;
  disableNetwork: (chainId: number) => void;
}

export const createEnableNetworkFunction = ({
  enableNetwork,
}: Pick<NetworkFunctionsDeps, 'enableNetwork'>) => {
  return async ({ chainId }: EnableNetworkParams) => {
    enableNetwork(chainId);
    return {
      content: `Network with chain ID ${chainId} has been enabled.`,
    };
  };
};

export const createDisableNetworkFunction = ({
  disableNetwork,
}: Pick<NetworkFunctionsDeps, 'disableNetwork'>) => {
  return async ({ chainId }: DisableNetworkParams) => {
    disableNetwork(chainId);
    return {
      content: `Network with chain ID ${chainId} has been disabled.`,
    };
  };
};
