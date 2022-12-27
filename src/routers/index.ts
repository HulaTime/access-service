import { JwtPayload } from 'jsonwebtoken';

import accounts from './Accounts';
import users from './Users';
import authenticate from './Authenticate';

const noNullReducer = <T> (response: T) => (acc: T, key: keyof T): T => {
  if (response[key]) {
    acc[key] = response[key];
  }
  return acc;
};

export function stripNullResponseValues
  <T extends Record<string, unknown>>(response: T, disable?: boolean): T;
export function stripNullResponseValues
  <T extends Record<string, unknown>>(response: T[], disable?: boolean): T[];
export function stripNullResponseValues
  <T extends Record<string, unknown>> (response: T | T[], disable = false): T | T[] {
  if (disable) {
    return response;
  }
  if (Array.isArray(response)) {
    return response.map(el => {
      const reducer = noNullReducer(el);
      const responseKeys: Array<keyof T> = Object.keys(el);
      return responseKeys.reduce(reducer, {} as T);
    });
  }
  const reducer = noNullReducer(response);
  const responseKeys: Array<keyof T> = Object.keys(response);
  return responseKeys.reduce(reducer, {} as T);
}

export type ResLocals = {
  authClaims: JwtPayload;
}

export default {
  accounts,
  users,
  authenticate,
};
