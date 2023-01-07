import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { ApplicationsEntity, UsersEntity } from '../dbEntities';

export interface IAuthService {
  getClientApplication(): Promise<ApplicationsEntity | null>;
  getUser(): Promise<UsersEntity | null>;
  verifyCredentials(secret: string): Promise<boolean>;
}

type ClientCreds = {
  clientId: string;
  clientSecret: string;
}

type UserEmailCreds = {
  email: string;
  password: string;
}

type UserNameCreds = {
  username: string;
  password: string;
}

type AuthCreds = ClientCreds | UserEmailCreds | UserNameCreds

export default class AuthService implements IAuthService {
  private readonly authCredentials: AuthCreds;

  private appRepository: Repository<ApplicationsEntity>;

  private userRepository: Repository<UsersEntity>;

  constructor(
    authCredentials: AuthCreds,
    applicationRepository: Repository<ApplicationsEntity>,
    userRepository: Repository<UsersEntity>,
  ) {
    this.authCredentials = authCredentials;
    this.appRepository = applicationRepository;
    this.userRepository = userRepository;
  }

  async getClientApplication(): Promise<ApplicationsEntity | null> {
    if (AuthService.isClientCredentials(this.authCredentials)) {
      return this.appRepository.findOneBy({ clientId: this.authCredentials.clientId });
    }
    return null;
  }

  async getUser(): Promise<UsersEntity | null> {
    if (AuthService.isUserEmailCredentials(this.authCredentials)) {
      return this.userRepository.findOneBy({ email: this.authCredentials.email });
    }
    if (AuthService.isUserNameCredentials(this.authCredentials)) {
      return this.userRepository.findOneBy({ username: this.authCredentials.username });
    }
    return null;
  }

  async verifyCredentials(): Promise<boolean> {
    if (AuthService.isClientCredentials(this.authCredentials)) {
      const application = await this.getClientApplication();
      if (!application) {
        return false;
      }
      return await argon2.verify(application.clientSecretHash, this.authCredentials.clientSecret);
    }
    if (
      AuthService.isUserEmailCredentials(this.authCredentials)
      || AuthService.isUserNameCredentials(this.authCredentials)
    ) {
      const user = await this.getUser();
      if (!user) {
        return false;
      }
      return await argon2.verify(user.passwordHash, this.authCredentials.password);
    }
    return false;
  }

  private static isClientCredentials(credentials: AuthCreds): credentials is ClientCreds {
    return !!(credentials as ClientCreds).clientId;
  }

  private static isUserEmailCredentials(credentials: AuthCreds): credentials is UserEmailCreds {
    return !!(credentials as UserEmailCreds).email;
  }

  private static isUserNameCredentials(credentials: AuthCreds): credentials is UserNameCreds {
    return !!(credentials as UserNameCreds).username;
  }
}
