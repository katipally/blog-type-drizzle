import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from './drizzle/schema';
export declare class AppService implements OnModuleInit {
    private readonly typeormDataSource;
    private readonly drizzleDb;
    constructor(typeormDataSource: DataSource, drizzleDb: MySql2Database<typeof schema>);
    onModuleInit(): Promise<void>;
    private initializeDrizzleTables;
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        orms: {
            typeorm: {
                status: string;
                manages: string[];
            };
            drizzle: {
                status: string;
                manages: string[];
            };
        };
        database: {
            host: string;
            name: string;
        };
        error?: undefined;
    } | {
        status: string;
        timestamp: string;
        error: any;
        orms?: undefined;
        database?: undefined;
    }>;
}
