import React from 'react';

export function ShowIf({
  children,
  condition,
}: {
  children: JSX.Element;
  condition: boolean;
}) {
  if (condition) {
    return <>{children}</>;
  } else {
    return null;
  }
}
