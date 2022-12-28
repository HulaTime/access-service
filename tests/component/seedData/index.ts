import testDatasource from '../../test-datasource';
import { AccountsEntity, ApplicationsEntity, UsersEntity } from '../../../src/dbEntities';

import accountsData from './accountsData';
import usersData from './usersData';
import applicationsData from './applicationsData';

export const insertSeedData = async () :Promise<void> => {
  const accountsRepository = testDatasource.getRepository(AccountsEntity);
  const seedAccounts = accountsData.map(account => accountsRepository.insert(account));
  await Promise.all(seedAccounts);

  const usersRepository = testDatasource.getRepository(UsersEntity);
  const seedUsers = usersData.map(async data => {
    await data.user.setPassword(data.password);
    return usersRepository.insert(data.user);
  });
  await Promise.all(seedUsers);

  const applicationsRepository = testDatasource.getRepository(ApplicationsEntity);
  const seedApps = applicationsData.map(async data => {
    await data.application.setClientSecret(data.clientSecret);
    return applicationsRepository.insert(data.application);
  });
  await Promise.all(seedApps);
};

export const dropAllTestData = async () : Promise<void> => {
  await testDatasource.createQueryBuilder()
    .delete()
    .from(ApplicationsEntity)
    .execute();

  await testDatasource.createQueryBuilder()
    .delete()
    .from(UsersEntity)
    .execute();

  await testDatasource.createQueryBuilder()
    .delete()
    .from(AccountsEntity)
    .execute();
};
