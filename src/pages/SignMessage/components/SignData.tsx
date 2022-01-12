/**
 * This is in support of of EIP-712
 * @link https://eips.ethereum.org/EIPS/eip-712
 *
 * Here is metamasks docs on this @link https://docs.metamask.io/guide/signing-data.html#sign-typed-data-v1
 *
 * @param param0
 * @returns
 */
export function SignData({ data }: { data: any }) {
  return (
    <>
      <div>Sign data and SignDataV1</div>

      {data &&
        data.map((x, i) => {
          const { name, value } = x;

          return (
            <div key={i}>
              <span className="label">{name}: </span>
              <span className="value">{`${value}`}</span>
            </div>
          );
        })}
    </>
  );
}
