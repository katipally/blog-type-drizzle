import * as mysql from 'mysql2/promise';
import * as schema from './schema';
export declare const DRIZZLE_DB = "DRIZZLE_DB";
export declare const drizzleProvider: {
    provide: string;
    useFactory: () => Promise<import("drizzle-orm/mysql2").MySql2Database<typeof schema> & {
        $client: mysql.Connection;
    }>;
};
