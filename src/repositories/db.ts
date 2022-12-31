import { createConnection } from 'mysql2/promise';
import general from '../config';

const { database } = general;

export const getConnection = async () => await createConnection({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password,
    port: database.port,
    typeCast: function castField (field, defaultTypeCasting) {
      if (field.type === 'BIT' && field.length === 1) {
        const bytes = field.buffer();
        return bytes[0] === 1;
      }
      return defaultTypeCasting();
    },
  });

// export const query = async (
//   sql: string,
//   params: Array<string | number | Date | boolean>
// ) => {
//   const connection = 
//   const [results] = await connection.query(sql, params);
//   return results;
// };
