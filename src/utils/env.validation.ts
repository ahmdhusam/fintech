import * as Joi from 'joi';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(8),
  JWT_EXPIRES_IN: Joi.string().required().length(2),
}).required();
