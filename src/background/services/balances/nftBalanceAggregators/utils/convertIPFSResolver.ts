const CLOUDFLARE_IPFS_URL = 'https://cloudflare-ipfs.com/ipfs';
const COVALENT_IMG_SIZER =
  'https://image-proxy.svc.prod.covalenthq.com/cdn-cgi/image';

export function convertIPFSResolver(imgUrl: string) {
  if (imgUrl.includes('ipfs')) {
    const ipfsHash = imgUrl.split('/').pop();
    /**
     * Converting everything to cloudflare because some ipfs resolver try and rate limit
     *
     * Sometimes cloudflare was slow to resolve so if this becomes an issue we can sart using infura. Which seemed to
     * be faster but clooudflare seems like the more stable solution.
     */
    return `${CLOUDFLARE_IPFS_URL}/${ipfsHash}`;
  }

  return imgUrl;
}
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
  const url = convertIPFSResolver(imgUrl);
  return `${COVALENT_IMG_SIZER}/width=${imageSize},fit/${url}`;
}
