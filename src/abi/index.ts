import abiDecoder from 'abi-decoder';

const pangolinAbi = require('./pangolin.abi.json');
abiDecoder.addABI(pangolinAbi);

export interface KnownContract {
  docs: string;
  name: string;
  abi: any;
  decoder(data: any): JSON;
  parser(data: any): any;
}

export const KnownContractABIs = new Map<string, KnownContract>([
  [
    '0xe54ca86531e17ef3616d22ca28b0d458b6c89106',
    {
      docs: 'https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexactethfortokens',
      name: 'pangolin',
      abi: pangolinAbi,
      decoder: abiDecoder.decodeMethod.bind(abiDecoder),
      parser(data: any) {
        return (data.params as any[]).reduce(
          (acc, prop) => {
            return {
              ...acc,
              [prop.name]: prop.value,
            };
          },
          { contractCall: data.name }
        );
      },
    },
  ],
]);
