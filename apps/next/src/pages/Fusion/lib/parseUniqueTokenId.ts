import { TokenType } from '@avalabs/vm-module-types';

export type ParsedUniqueTokenId = {
  type: TokenType;
  identifier: string;
  coreChainId: number;
};

const TOKEN_TYPES = new Set<string>(Object.values(TokenType));

export const parseUniqueTokenId = (
  id: string,
): ParsedUniqueTokenId | undefined => {
  const firstSeparator = id.indexOf(':');
  const lastSeparator = id.lastIndexOf(':');

  if (firstSeparator === -1 || firstSeparator === lastSeparator) {
    return undefined;
  }

  const type = id.slice(0, firstSeparator);
  const identifier = id.slice(firstSeparator + 1, lastSeparator);
  const chainId = id.slice(lastSeparator + 1);

  if (!TOKEN_TYPES.has(type) || !identifier || !/^\d+$/.test(chainId)) {
    return undefined;
  }

  return {
    type: type as TokenType,
    identifier,
    coreChainId: Number(chainId),
  };
};
