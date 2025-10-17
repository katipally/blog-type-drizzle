import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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
