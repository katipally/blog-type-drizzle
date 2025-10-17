import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { User } from './typeorm/entities/user.entity';
import { Post } from './typeorm/entities/post.entity';
import { drizzleProvider } from './drizzle/drizzle.provider';

@Module({
  imports: [
    // TypeORM Configuration - MariaDB
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME || 'blog_db',
      entities: [User, Post],
      synchronize: process.env.NODE_ENV !== 'production', // Never true in production
      logging: false,
    }),

    // Feature Modules
    UsersModule,
    PostsModule,
    CommentsModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService, drizzleProvider],
})
export class AppModule {}
