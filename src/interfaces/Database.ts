export type DBWhere = {
  [key: string]: string | number | unknown;
}

interface Database <T> {
  get(id: string): Promise<T>;

  insert(resource: T): Promise<void>;

  update(id: string, resource: Partial<T>): Promise<T>;

  delete(where: DBWhere): Promise<void>;
}

export default Database;
