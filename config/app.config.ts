import * as dotenv from 'dotenv';

dotenv.config();

const required = (varName: string): string => {
  const variable = process.env[varName];
  if (!variable) {
    throw new Error(`Env var "${varName}" is required but is not currently set`);
  }
  return variable;
};

export const accessTokenPrivateKey = required('ACCESS_TOKEN_PRIVATE_KEY');

export const accessTokenPassphrase = required('ACCESS_TOKEN_KEY_PASSPHRASE');

export const accessTokenPublicKey = required('ACCESS_TOKEN_PUBLIC_KEY');
