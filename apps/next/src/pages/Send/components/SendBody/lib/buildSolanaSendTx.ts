import { TokenType } from '@avalabs/vm-module-types';
import {
  SolanaProvider,
  transferSol,
  transferToken,
} from '@avalabs/core-wallets-sdk';

import {
  SolanaNativeTokenBalance,
  SolanaSplTokenBalance,
  SvmCapableAccount,
} from '@core/types';

type BuildSolanaSendTxArgs = {
  from: SvmCapableAccount;
  to: string;
  amount: bigint;
  token: SolanaNativeTokenBalance | SolanaSplTokenBalance;
  provider: SolanaProvider;
};

export const buildSolanaSendTx = async ({
  from,
  to,
  amount,
  token,
  provider,
}: BuildSolanaSendTxArgs) => {
  if (token.type === TokenType.NATIVE) {
    return transferSol({
      from: from.addressSVM,
      to,
      amount,
      provider,
    });
  }

  return transferToken({
    from: from.addressSVM,
    to,
    mint: token.address,
    amount,
    decimals: token.decimals,
    provider,
  });
};
