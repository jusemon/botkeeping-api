import joi from 'joi';
import { DatabaseConfig } from '../../models/config';

const envSchema = joi
  .object({
    DB_USER: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    DB_PORT: joi.number().default(3306),
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const database: DatabaseConfig = {
  user: envVars.DB_USER,
  host: envVars.DB_HOST,
  password: envVars.DB_PASSWORD,
  name: envVars.DB_DATABASE,
  port: envVars.DB_PORT,
};
