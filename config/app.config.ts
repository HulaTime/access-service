const required = (varName: string): string => {
  const variable = process.env[varName];
  if (!variable) {
    throw new Error(`Env var "${varName}" is required but is not currently set`);
  }
  return variable;
};

export const authTokenSecret = required('AUTH_TOKEN_SECRET');
