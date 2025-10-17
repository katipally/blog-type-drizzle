import { Repository } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { User } from '../typeorm/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as schema from '../drizzle/schema';
export declare class UsersService {
    private readonly userRepository;
    private readonly drizzleDb;
    constructor(userRepository: Repository<User>, drizzleDb: MySql2Database<typeof schema>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    update(id: number, updateData: Partial<CreateUserDto>): Promise<User>;
    remove(id: number): Promise<void>;
}
