import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { User } from '../typeorm/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { DRIZZLE_DB } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { eq, count } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: MySql2Database<typeof schema>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    // CROSS-ORM INTERACTION: Enrich with Drizzle comment count
    for (const user of users) {
      const [result] = await this.drizzleDb
        .select({ count: count() })
        .from(schema.comments)
        .where(eq(schema.comments.userId, user.id));
      
      user.commentCount = result?.count || 0;
    }

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // CROSS-ORM INTERACTION: Get comment count from Drizzle
    const [result] = await this.drizzleDb
      .select({ count: count() })
      .from(schema.comments)
      .where(eq(schema.comments.userId, user.id));
    
    user.commentCount = result?.count || 0;

    return user;
  }

  async update(id: number, updateData: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    // Note: Comments will need manual cleanup or foreign key cascade
  }
}
