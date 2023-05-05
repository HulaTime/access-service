import { createLogger } from 'bunyan';
import { DataSource } from 'typeorm';

import AccountsRepository from '../../../src/database/typeorm/AccountsRepository';
import testDatasource from '../../test-datasource';
import { AccountsEntity } from '../../../src/database/typeorm/entities';
import { IAccount } from '../../../src/models/Account';

const testDescription = 'for tests';

const testLogger = createLogger({ name: 'test logger' });

describe('AccountsRepository', () => {
  let datasource: DataSource;

  beforeAll(async () => {
    datasource = await testDatasource.initialize();
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  afterEach(async () => {
    const accountsRepository = datasource.getRepository(AccountsEntity);
    await accountsRepository.delete({ description: testDescription });
  });

  test('it should exist', () => {
    expect(AccountsRepository).toBeDefined();
  });

  describe('#insert', () => {
    test('I can add a new account record to the db', async () => {
      const accountsRepository = new AccountsRepository(testLogger);
      await accountsRepository.insert({
        id: 'bd36f9e6-02eb-465f-af19-11a128e5af3b',
        name: 'test-account',
        description: testDescription,
      });
    });
  });

  describe('#get', () => {
    const accountAlpha: IAccount = {
      id: '7499d1f8-1da0-4590-9c3b-a5da44203c3d',
      name: 'alpha',
      description: 'alpha test account',
    };

    beforeAll(async () => {
      const accountsRepository = datasource.getRepository(AccountsEntity);
      await accountsRepository.insert(accountAlpha);
    });

    afterAll(async () => {
      const accountsRepository = datasource.getRepository(AccountsEntity);
      await accountsRepository.delete({ id: accountAlpha.id });
    });

    test('I can get a record from the db', async () => {
      const accountsRepository = new AccountsRepository(testLogger);
      const result = await accountsRepository.get(accountAlpha.id);
      expect(result).toEqual(accountAlpha);
    });
  });

  describe('#update', () => {})
});
