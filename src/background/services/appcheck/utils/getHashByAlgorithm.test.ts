import { Algorithm } from '../models';
import getHashByAlgorithm from './getHashByAlgorithm';

describe('getHashByAlgorithm', () => {
  const cases: Record<Algorithm, string> = {
    [Algorithm.SHA256]:
      '0d45f5fd462b8c70bffb10021ac1bcff3f58f29b1faf7568595095427d42812c',
    [Algorithm.SHA512]:
      'de91078a5b1eb16864d1db7baffa09ab367e6ac301fa61a484dfd7095def57de8bedfa2ba415f59d7e76753c807d0fc5b0e8963d1fd1992b6936ba9383c4975e',
  };

  it('throws for unsupported algorithms', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(() => getHashByAlgorithm('unknown', 'core')).toThrow(
      'unsupported algorithm "unknown"',
    );
  });

  it.each(Object.entries(cases))(
    'uses the correct algorithm',
    (algorithm, expected) => {
      expect(getHashByAlgorithm(algorithm as Algorithm, 'core')).toBe(expected);
    },
  );
});
