import { createPool, Pool } from 'mysql2/promise';
import config from '../config';
const { database } = config;
let globalPool: Pool | undefined = undefined;

export const getPool = () => {
  if (globalPool) {
    return globalPool;
  }

  globalPool = createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password,
    port: database.port,
    timezone: 'Z',
    typeCast: function castField(field, defaultTypeCasting) {
      if (field.type === 'BIT' && field.length === 1) {
        const bytes = field.buffer();
        return bytes[0] === 1;
      }
      return defaultTypeCasting();
    },
  });
  return globalPool;
};
