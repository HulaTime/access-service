import { QueryFailedError } from 'typeorm';

export enum errorCodes {
  UniqueViolation = '23505',
  CheckViolation = '23514',
  NotNullViolation = '23502',
  ForeignKeyViolation = '23503'
}

export const isDbError =
  (err: unknown | QueryFailedError ): err is QueryFailedError => err instanceof QueryFailedError;
