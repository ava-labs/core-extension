import { createHash } from 'crypto';
import { Algorithm } from '../models';

const getHashByAlgorithm = (algorithm: Algorithm, data: string) => {
  switch (algorithm) {
    case Algorithm.SHA256:
      return createHash('sha256').update(data).digest('hex');
    case Algorithm.SHA512:
      return createHash('sha512').update(data).digest('hex');
    default:
      throw new Error(`unsupported algorithm "${algorithm}"`);
  }
};

export default getHashByAlgorithm;
