import Logger from 'bunyan';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';

import AccountErrCodes from '../../errors/errorCodes/accountErrorCodes';
import appDatasource from '../../../db/app-datasource';
import Account from '../../models/Account';
import User from '../../models/User';
import { components } from '../../../types/api';
import { AccessError } from '../../errors';
import { AccountsEntity, UsersEntity } from '../../database/typeorm/entities';
import { AuthClaims } from '../../lib/AccessToken';

export default class CreateAccounts {
  private readonly accountsEntity: Repository<AccountsEntity>;

  private readonly usersRepository: Repository<UsersEntity>;

  private readonly data: components['schemas']['AccountRequest'];

  private readonly authClaims: AuthClaims;

  constructor(data: components['schemas']['AccountRequest'], authClaims: AuthClaims) {
    this.data = data;
    this.accountsEntity = appDatasource.getRepository(AccountsEntity);
    this.usersRepository = appDatasource.getRepository(UsersEntity);
    this.authClaims = authClaims;
  }

  async exec(logger: Logger): Promise< Account> {
    const { sub: userId } = this.authClaims;
    const [existingUser] = await this.usersRepository.find({ where: { id: userId } });
    if (!existingUser) {
      logger.info({
        msg: `Could not find a user with id "${userId}"` ,
        authClaims: this.authClaims,
      });
      throw new AccessError(AccountErrCodes.userDoesNotExist);
    }

    const account = new Account({
      id: uuid(),
      name: this.data.name,
      description: this.data.description,
    });
    await this.accountsEntity.insert(account);
    const user = new User(existingUser, account);
    await this.usersRepository.update(
      { id: existingUser.id },
      user,
    );
    return account;
  }
}
