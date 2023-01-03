import joi from 'joi';
import { ServerConfig } from '../../models/config';

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    API_VERSION: joi.number().default(1),
    ALLOWED_ORIGINS: joi.string().default('http://localhost:3000')
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const server: ServerConfig = {
  port: envVars.PORT,
  apiVersion: envVars.API_VERSION,
  origins: envVars.ALLOWED_ORIGINS.split(',')
};
