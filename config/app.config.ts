import * as dotenv from 'dotenv';

import Config from './Config';

dotenv.config();

const config = new Config();

export const accessTokenPrivateKey = config.required ('ACCESS_TOKEN_PRIVATE_KEY');

export const accessTokenPassphrase = config.required('ACCESS_TOKEN_KEY_PASSPHRASE');

export const accessTokenPublicKey = config.required('ACCESS_TOKEN_PUBLIC_KEY');

export const areNullValuesSupported = !config.boolean('STRIP_NULL_RESPONSE_VALUES');
