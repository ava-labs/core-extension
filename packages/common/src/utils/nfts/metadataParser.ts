import { RawTokenAttribute, TokenAttribute } from '@core/types';

export const parseAttributes = (attributes) => {
  return Array.isArray(attributes)
    ? parseRawAttributesArray(attributes)
    : attributes === 'string'
      ? parseRawAttributesString(attributes)
      : attributes;
};

export const parseRawAttributesString = (rawAttributesString?: string) => {
  if (rawAttributesString === undefined) return [];
  const rawAttributes: RawTokenAttribute[] = rawAttributesString
    ? JSON.parse(rawAttributesString)
    : [];

  const parsedAttributes = rawAttributes.reduce(
    (acc: TokenAttribute[], attr) => [
      ...acc,
      {
        name: attr.name ?? attr.trait_type,
        value: attr.value,
      },
    ],
    [],
  );

  return parsedAttributes;
};

const parseRawAttributesArray = (
  rawAttributesArray:
    | { trait_type?: string; name?: string; value: string }[]
    | undefined,
) => {
  if (rawAttributesArray === undefined) return [];

  const parsedAttributes = rawAttributesArray.map((attr) => {
    return {
      name: attr.name ?? attr.trait_type,
      value: attr.value,
    };
  });

  return parsedAttributes;
};
