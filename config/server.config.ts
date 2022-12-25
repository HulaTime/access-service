import * as dotenv from 'dotenv';

import Config from './Config';

dotenv.config();

const config = new Config();

export const port = config.number('PORT');
