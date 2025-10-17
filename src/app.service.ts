import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DRIZZLE_DB } from './drizzle/drizzle.provider';
import * as schema from './drizzle/schema';
import { sql } from 'drizzle-orm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly typeormDataSource: DataSource,
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: MySql2Database<typeof schema>,
  ) {}

  async onModuleInit() {
    // Initialize Drizzle tables on startup if they don't exist
    try {
      console.log('🔧 Initializing Drizzle ORM tables...');
      await this.initializeDrizzleTables();
      console.log('✅ Drizzle ORM tables initialized successfully');
    } catch (error) {
      console.error('⚠️  Warning: Could not initialize Drizzle tables:', error.message);
      console.error('   Tables may already exist or there may be a connection issue.');
    }
  }

  private async initializeDrizzleTables() {
    // Create comments table if it doesn't exist
    await this.drizzleDb.execute(sql`
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

    // Create tags table if it doesn't exist
    await this.drizzleDb.execute(sql`
      CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create post_tags junction table if it doesn't exist
    await this.drizzleDb.execute(sql`
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
      // Test TypeORM connection
      await this.typeormDataSource.query('SELECT 1');
      const typeormConnected = true;

      // Test Drizzle connection
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
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
