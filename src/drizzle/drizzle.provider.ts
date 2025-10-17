import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const DRIZZLE_DB = 'DRIZZLE_DB';

export const drizzleProvider = {
  provide: DRIZZLE_DB,
  useFactory: async () => {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'blog_db',
    });
    
    return drizzle(connection, { schema, mode: 'default' });
  },
};
