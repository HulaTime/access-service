import Logger from 'bunyan';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

import { components } from '../../../types/api';
import { ConflictError } from '../../errors';
import appDatasource from '../../../db/app-datasource';
import { Repository } from 'typeorm';
import { ApplicationsRepository, UsersRepository } from '../../repositories';

type AuthenticateUserEmail = {
  email: string;
  password: string;
}

type AuthenticateApp = components['schemas']['AuthenticateApp']

const isAppAuthRequest = (data: components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp']):
  data is AuthenticateApp => !!(data as AuthenticateApp).clientId;

const isUserEmailRequest = (data: components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp']):
  data is AuthenticateUserEmail => !!(data as AuthenticateUserEmail).email;

export default class Authenticate {
  private readonly usersRepository: Repository<UsersRepository>;

  private readonly applicationsRepository: Repository<ApplicationsRepository>;

  private readonly data: components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp'];

  constructor(data: components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp']) {
    this.data = data;
    this.usersRepository = appDatasource.getRepository(UsersRepository);
    this.applicationsRepository = appDatasource.getRepository(ApplicationsRepository);
  }


  async exec(logger: Logger): Promise<components['schemas']['AuthenticateRes']> {
    if (isAppAuthRequest(this.data)) {
      const { clientId, clientSecret } = this.data;
      const application = await this.applicationsRepository.findOneBy({ clientId });
      if (!application) {
        logger.error();
        throw new ConflictError('app doesn\'t exist');
      }
      const { clientSecret: clientSecretHash } = application;
      const isValid = await argon2.verify(clientSecretHash, clientSecret);
      if (!isValid) {
        throw new Error('Forbidden');
      }
      const accessToken = jwt.sign({ sub: application.id }, 'abc123');
      return { accessToken };
    }

    if (isUserEmailRequest(this.data)) {
      const { email, password } = this.data;
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        logger.error();
        throw new ConflictError('user doesn\'t exist');
      }
      const { password: passwordHash } = user;
      const isValid = await argon2.verify(password, passwordHash);
      if (!isValid) {
        throw new Error('Forbidden');
      }
      const accessToken = jwt.sign({ sub: user.id }, 'abc123');
      return { accessToken };
    } else {
      const { username, password } = this.data;
      const user = await this.usersRepository.findOneBy({ username });
      if (!user) {
        logger.error();
        throw new ConflictError('user doesn\'t exist');
      }
      const { password: passwordHash } = user;
      const isValid = await argon2.verify(password, passwordHash);
      if (!isValid) {
        throw new Error('Forbidden');
      }
      const accessToken = jwt.sign({ sub: user.id }, 'abc123');
      return { accessToken };
    }
  }
}
