export default class Config {
  required(varName: string): string {
    const variable = process.env[varName];
    if (!variable) {
      throw new Error(`Env var "${varName}" is required but is not currently set`);
    }
    return variable;
  }

  boolean(varName: string): boolean {
    const variable = process.env[varName];
    return variable === 'true' || variable === '1';
  }

  number(varName: string): number | undefined {
    const variable = process.env[varName];
    if (!variable) {
      return undefined;
    }
    return parseInt(variable, 10);
  }
}
