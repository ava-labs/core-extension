import React, { ReactElement } from 'react';

export const Providers = ({
  providers,
  children,
}: {
  providers: ReactElement[];
  children: ReactElement;
}) => {
  const renderProvider = (
    renderedProviders: ReactElement[],
    renderedChildren: ReactElement,
  ) => {
    const [provider, ...restProviders] = renderedProviders;

    if (provider) {
      return React.cloneElement(
        provider,
        undefined,
        renderProvider(restProviders, renderedChildren),
      );
    }

    return renderedChildren;
  };
  return renderProvider(providers, children);
};
