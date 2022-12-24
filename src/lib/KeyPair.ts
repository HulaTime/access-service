import { ECKeyPairOptions, generateKeyPairSync } from 'crypto';

import { accessTokenPassphrase } from '../../config/app.config';

export default class KeyPair {
  privateKey: string;

  publicKey: string;

  constructor(passphrase?: string) {
    const options: ECKeyPairOptions<'pem', 'pem'> = {
      namedCurve: 'secp521r1',
      privateKeyEncoding: {
        format: 'pem',
        type: 'pkcs8',
        cipher: 'aes-256-cbc',
        passphrase: passphrase ?? accessTokenPassphrase,
      },
      publicKeyEncoding: {
        format: 'pem',
        type: 'spki',
      },
    };
    const { privateKey, publicKey } = generateKeyPairSync('ec', options);
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
}
