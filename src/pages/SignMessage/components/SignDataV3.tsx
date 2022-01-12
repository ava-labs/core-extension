/**
 * @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v3
 * @param param0
 * @returns
 */
export function SignDataV3({ data }: { data: any }) {
  return (
    <>
      <div>SignDataV3</div>
      {data &&
        Object.entries(data).map(([label, value], i) => {
          const padLeft = typeof value !== 'object' || value === null;

          if (label !== 'types') {
            return (
              <div className={padLeft ? 'group' : 'group leaf'} key={i}>
                <span className="label">{label}: </span>
                {typeof value === 'object' && value !== null ? (
                  <span>attempting a recursive call?</span>
                ) : (
                  //   renderDataTypev3(value)
                  <span className="value">{`${value}`}</span>
                )}
              </div>
            );
          }
        })}
    </>
  );
}
