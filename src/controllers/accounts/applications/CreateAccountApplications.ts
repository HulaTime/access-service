import * as crypto from 'crypto';

import Logger from 'bunyan';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';

import appDatasource from '../../../../db/app-datasource';
import { components } from '../../../../types/api';
import { AccessError } from '../../../errors';
import { AccountsEntity, ApplicationsEntity, UsersEntity } from '../../../dbEntities';
import AccountErrCodes from '../../../errors/errorCodes/accountErrorCodes';
import Account from '../../../models/Account';
import Application, { IApplication } from '../../../models/Application';
import { AuthClaims } from '../../../lib/AccessToken';

export default class CreateAccountApplications {
  private readonly accountsRepository: Repository<AccountsEntity>;

  private readonly usersRepository: Repository<UsersEntity>;

  private readonly applicationsRepository: Repository<ApplicationsEntity>;

  private readonly accountId: string;

  private readonly data: components['schemas']['AccountAppRequest'];

  private readonly authClaims: AuthClaims;

  constructor(
    accountId: string,
    data: components['schemas']['AccountAppRequest'],
    authClaims: AuthClaims) {
    this.accountId = accountId;
    this.data = data;
    this.authClaims = authClaims;
    this.accountsRepository = appDatasource.getRepository(AccountsEntity);
    this.usersRepository = appDatasource.getRepository(UsersEntity);
    this.applicationsRepository = appDatasource.getRepository(ApplicationsEntity);
  }

  async exec(logger: Logger): Promise<{ application: IApplication; clientSecret: string }> {
    const existingAccount = await this.accountsRepository.findOneBy({ id: this.accountId });
    if (!existingAccount) {
      logger.info(`Account with id "${this.accountId}" does not exist`);
      throw new AccessError(AccountErrCodes.applicationAccountDoesNotExist);
    }
    const account = new Account(existingAccount);
    const [authUser] = await this.usersRepository.find(
      { where: { id: this.authClaims.sub } },
    );
    if (!authUser) {
      logger.error(`User with id "${this.authClaims.sub}" does not exist`);
      throw new AccessError(AccountErrCodes.userDoesNotExist);
    }

    const clientSecret: string = crypto
      .createHash('sha256')
      .update(crypto.randomBytes(42))
      .digest('hex');

    const application = new Application({
      id: uuid(),
      name: this.data.name,
      clientId: uuid(),
      description: this.data.description,
    }, account);
    await application.setClientSecret(clientSecret);
    await this.applicationsRepository.insert(application);
    return { application, clientSecret };
  }
}
