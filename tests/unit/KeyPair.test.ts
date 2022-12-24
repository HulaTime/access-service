import * as crypto from 'crypto';

import KeyPair from '../../src/lib/KeyPair';
import { accessTokenPassphrase } from '../../config/app.config';

describe('KeyPair', () => {
  it('should generate a pem key pair by default, that can be used to verify each other', () => {
    const keyPair = new KeyPair();
    const data = Buffer.from('abc');
    const signature = crypto.sign('sha256', data, {
      key: keyPair.privateKey,
      format: 'pem',
      passphrase: accessTokenPassphrase,
    });
    const isVerified = crypto.verify('sha256', data, {
      key: keyPair.publicKey,
      format: 'pem',
    }, signature);
    expect(isVerified).toBe(true);
  });
});
