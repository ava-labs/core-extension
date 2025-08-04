import { cloneElement, FC, ReactElement } from 'react';

type Props = {
  providers: ReactElement[];
  children: ReactElement;
};

export const Providers: FC<Props> = ({ providers, children }) => {
  return providers.reduceRight(
    (node, provider) => cloneElement(provider, undefined, node),
    children,
  );
};
