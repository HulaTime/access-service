import  Application from '../../../src/models/Application';

import { alphaAccount } from './accountsData';

type AppTestData = {
  application: Application;
  clientSecret: string;
}

export const alphaAccountApplicationTescoClientSecret = 'fasfdjspfiewjfas;ljf';

export const alphaAccountApplicationTesco: AppTestData = {
  application: new Application({
    id: '7441672b-4cf1-4d82-a229-5b918846712d',
    clientId: 'e28b34fd-c9d1-46d6-9aaa-a9c7843196fb',
    name: 'tesco application',
  }, alphaAccount),
  clientSecret: alphaAccountApplicationTescoClientSecret,
};

export default [
  alphaAccountApplicationTesco,
];
