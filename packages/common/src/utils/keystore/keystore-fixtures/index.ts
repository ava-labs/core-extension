/**
 * All of the keys in the files below are for testing purposes only.
 * Do not use them in any other way.
 */

import KEYSTORE_FILE_V2 from './keystore-v2.json';
import KEYSTORE_FILE_V3 from './keystore-v3.json';
import KEYSTORE_FILE_V4 from './keystore-v4.json';
import KEYSTORE_FILE_V5 from './keystore-v5.json';
import KEYSTORE_FILE_V6 from './keystore-v6.json';
import KEYSTORE_FILE_V6_PKEY from './keystore-v6-private-key.json';

export const KEYSTORE_V2 = {
  file: KEYSTORE_FILE_V2,
  password: '111111111',
  expectedKeys: [
    { key: '2DvMW4ZsNVdiiBsrEdPBTDr47bTtgr4H8qQKXz2D37YKeTLwDw' },
    { key: '2rr9Fzq87moKGkkJeCjqewGEWY1KW4Na3bnF31GecggLL16XXG' },
  ],
  expectedPhrases: [
    {
      key: 'patient dragon there taxi husband medal amused push busy draft only axis chat august december essence vintage must liquid zero truck inner potato effort',
      type: 'mnemonic',
    },
    {
      key: 'visual arctic dune seminar ask balcony mass truly entire surround income battle clump village manual alter purpose various squeeze recipe round fade blame meadow',
      type: 'mnemonic',
    },
  ],
} as const;
export const KEYSTORE_V3 = {
  file: KEYSTORE_FILE_V3,
  password: '111111111',
  expectedKeys: [
    { key: '2DvMW4ZsNVdiiBsrEdPBTDr47bTtgr4H8qQKXz2D37YKeTLwDw' },
    { key: '2rr9Fzq87moKGkkJeCjqewGEWY1KW4Na3bnF31GecggLL16XXG' },
  ],
  expectedPhrases: [
    {
      key: 'patient dragon there taxi husband medal amused push busy draft only axis chat august december essence vintage must liquid zero truck inner potato effort',
      type: 'mnemonic',
    },
    {
      key: 'visual arctic dune seminar ask balcony mass truly entire surround income battle clump village manual alter purpose various squeeze recipe round fade blame meadow',
      type: 'mnemonic',
    },
  ],
} as const;
export const KEYSTORE_V4 = {
  file: KEYSTORE_FILE_V4,
  password: '111111111',
  expectedKeys: [{ key: 'jegD9bfh1qYjnyxUgnG92CEyAx7s4iZRgcYatdN2u1qhy1Tbr' }],
  expectedPhrases: [
    {
      key: 'general ritual pitch clump tragic entry possible detail case moment fade sleep cabin pig churn solid nation wrestle armor because simple disagree cry meat',
      type: 'mnemonic',
    },
  ],
} as const;
export const KEYSTORE_V5 = {
  file: KEYSTORE_FILE_V5,
  password: '111111111',
  expectedKeys: [
    {
      key: 'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit',
    },
  ],
  expectedPhrases: [
    {
      key: 'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit',
      type: 'mnemonic',
    },
  ],
} as const;
export const KEYSTORE_V6 = {
  file: KEYSTORE_FILE_V6,
  password: '111111111',
  expectedPhrases: [
    {
      key: 'solar ordinary sentence pelican trim ring indicate cake ordinary water size improve impose gentle frown sound know siren sick elder wait govern tortoise unit',
      type: 'mnemonic',
    },
  ],
} as const;
export const KEYSTORE_V6_PKEY = {
  file: KEYSTORE_FILE_V6_PKEY,
  password: '123123123',
  expectedPhrases: [
    {
      key: 'PrivateKey-2NryVJe1H9dqRbJggntZggK7fEmj3QpCHTqadj6i6m4qciANPE',
      type: 'singleton',
    },
  ],
} as const;
