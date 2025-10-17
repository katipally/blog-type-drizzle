import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../typeorm/entities/user.entity';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, drizzleProvider],
  exports: [UsersService],
})
export class UsersModule {}
