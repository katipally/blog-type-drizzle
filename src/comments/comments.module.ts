import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, drizzleProvider],
  exports: [CommentsService],
})
export class CommentsModule {}
