import request from 'supertest';

import app from '../../src/app';

type HttpMethods = 'post' | 'put' | 'get' | 'delete' | 'patch'

export const testNoAuthHeader = async <DataT extends object> (url: 'string', method: HttpMethods, data: DataT): Promise<void> => {
  const { body } = await request(app)
    [method](url)
    .send(data)
    .expect(401);
  expect(body).toEqual({ message: 'No authorization header provided' });
};
