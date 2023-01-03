export type DatabaseConfig = {
  user: string;
  host: string;
  password: string;
  name: string;
  port: number;
};

export type ServerConfig = {
  port: number;
  apiVersion: number;
};

export type RedisConfig = {
  host: string;
  port: number;
};

export type Config = {
  env: string;
  isDevelopment: boolean;
  database: DatabaseConfig;
  server: ServerConfig;
  redis: RedisConfig;
};
