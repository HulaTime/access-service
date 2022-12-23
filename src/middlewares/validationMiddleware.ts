import * as OpenApiValidator from 'express-openapi-validator';

const validationMiddleware = OpenApiValidator.middleware({
  apiSpec: `${__dirname}/../../api.yaml`,
  validateRequests: true,
  validateResponses: false,
});

export default validationMiddleware;
