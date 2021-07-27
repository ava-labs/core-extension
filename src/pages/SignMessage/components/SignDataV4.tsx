import React from 'react';

/**
 * @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v4
 * @param param0
 * @returns
 */
export function SignDataV4({ data }: { data: any }) {
  return (
    <>
      <div>SignDataV4</div>
      {data &&
        Object.entries(data).map(([label, value], i) => (
          <div className="group" key={i}>
            <span className="label">{label}: </span>
            {typeof value === 'object' && value !== null ? (
              <span>recursive value trying to be renddered?</span>
            ) : (
              // renderDataTypev4(value)
              <span className="value">{`${value}`}</span>
            )}
          </div>
        ))}
    </>
  );
}
