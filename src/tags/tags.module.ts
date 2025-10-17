import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  controllers: [TagsController],
  providers: [TagsService, drizzleProvider],
  exports: [TagsService],
})
export class TagsModule {}
