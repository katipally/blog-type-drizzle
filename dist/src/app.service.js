"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mysql2_1 = require("drizzle-orm/mysql2");
const drizzle_provider_1 = require("./drizzle/drizzle.provider");
const schema = __importStar(require("./drizzle/schema"));
const drizzle_orm_1 = require("drizzle-orm");
let AppService = class AppService {
    constructor(typeormDataSource, drizzleDb) {
        this.typeormDataSource = typeormDataSource;
        this.drizzleDb = drizzleDb;
    }
    async onModuleInit() {
        try {
            console.log('🔧 Initializing Drizzle ORM tables...');
            await this.initializeDrizzleTables();
            console.log('✅ Drizzle ORM tables initialized successfully');
        }
        catch (error) {
            console.error('⚠️  Warning: Could not initialize Drizzle tables:', error.message);
            console.error('   Tables may already exist or there may be a connection issue.');
        }
    }
    async initializeDrizzleTables() {
        await this.drizzleDb.execute((0, drizzle_orm_1.sql) `
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);
        await this.drizzleDb.execute((0, drizzle_orm_1.sql) `
      CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        await this.drizzleDb.execute((0, drizzle_orm_1.sql) `
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `);
    }
    async getHealth() {
        try {
            await this.typeormDataSource.query('SELECT 1');
            const typeormConnected = true;
            await this.drizzleDb.select().from(schema.tags).limit(1);
            const drizzleConnected = true;
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                orms: {
                    typeorm: {
                        status: typeormConnected ? 'connected' : 'disconnected',
                        manages: ['users', 'posts'],
                    },
                    drizzle: {
                        status: drizzleConnected ? 'connected' : 'disconnected',
                        manages: ['comments', 'tags', 'post_tags'],
                    },
                },
                database: {
                    host: process.env.DATABASE_HOST || 'localhost',
                    name: process.env.DATABASE_NAME || 'blog_db',
                },
            };
        }
        catch (error) {
            return {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: error.message,
            };
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE_DB)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        mysql2_1.MySql2Database])
], AppService);
//# sourceMappingURL=app.service.js.map