import joi from 'joi';
import {RedisConfig } from '../../models/config';

const envSchema = joi
  .object({
    REDIS_HOST: joi.string().default('localhost'),
    REDIS_PORT: joi.number().default(6379),
  })
  .unknown()
  .required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const redis: RedisConfig = {
  host: envVars.REDIS_HOST,
  port: envVars.REDIS_PORT,
};
