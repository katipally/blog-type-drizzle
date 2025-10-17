import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '../typeorm/entities/post.entity';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, drizzleProvider],
  exports: [PostsService],
})
export class PostsModule {}
