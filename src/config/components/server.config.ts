import joi from 'joi';
import { ServerConfig } from '../../models/config';

const envSchema = joi
  .object({
    PORT: joi.number(),
    API_VERSION: joi.number(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const server: ServerConfig = {
  port: envVars.PORT || 3000,
  apiVersion: envVars.API_VERSION || 1,
};
