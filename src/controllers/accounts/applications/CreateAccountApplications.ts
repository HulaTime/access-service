import * as crypto from 'crypto';

import Logger from 'bunyan';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';

import appDatasource from '../../../../db/app-datasource';
import { components } from '../../../../types/api';
import { AccessError } from '../../../errors';
import { AccountsRepository, ApplicationsRepository } from '../../../repositories';
import AccountErrCodes from '../../../errors/errorCodes/accountErrorCodes';

export default class CreateAccountApplications {
  private readonly accountsRepository: Repository<AccountsRepository>;

  private readonly applicationsRepository: Repository<ApplicationsRepository>;

  private readonly accountId: string;

  private readonly data: components['schemas']['AccountAppRequest'];

  constructor(accountId: string, data: components['schemas']['AccountAppRequest']) {
    this.accountId = accountId;
    this.data = data;
    this.accountsRepository = appDatasource.getRepository(AccountsRepository);
    this.applicationsRepository = appDatasource.getRepository(ApplicationsRepository);
  }

  async exec(logger: Logger): Promise<components['schemas']['CreateAccountAppResponse']> {
    const existingAccount = await this.accountsRepository.findOneBy({ id: this.accountId });
    if (!existingAccount) {
      logger.info(`Account with id "${this.accountId}" does not exist`);
      throw new AccessError(AccountErrCodes.applicationAccountDoesNotExist);
    }
    const clientSecret: string = crypto
      .createHash('sha256')
      .update(crypto.randomBytes(42))
      .digest('hex');
    const clientSecretHash: string = await argon2.hash(clientSecret);

    const accountApp = {
      id: uuid(),
      account: { id: existingAccount.id },
      name: this.data.name,
      clientId: uuid(),
      clientSecret: clientSecretHash,
      description: this.data.description,
    };
    await this.applicationsRepository.insert(accountApp);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account, ...accountData } = accountApp;
    return { ...accountData, clientSecret, accountId: existingAccount.id };
  }
}
