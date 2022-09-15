import { ipfsResolverWithFallback } from '@src/utils/ipsfResolverWithFallback';
import { CLOUDFLARE_IPFS_URL } from '../../models';

// const CLOUDFLARE_IPFS_URL = 'https://cloudflare-ipfs.com/ipfs';
const COVALENT_IMG_SIZER =
  'https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image';

/**
 * Covalent has an on the fly image resizer, it resolves image urls then resizes the image.
 *
 * This allows us to request smaller images depending on the UI needs
 *
 * @param imgUrl the url of the image to convert to size
 * @returns The url to the image which is sized at the time of request
 */
export function getSmallImageForNFT(
  imgUrl: string,
  imageSize: '256' | '512' | '1024' = '256'
) {
  const url = ipfsResolverWithFallback(imgUrl, CLOUDFLARE_IPFS_URL);
  return `${COVALENT_IMG_SIZER}/width=${imageSize},fit/${url}`;
}
