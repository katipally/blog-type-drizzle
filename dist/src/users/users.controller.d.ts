import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../typeorm/entities/user.entity").User>;
    findAll(): Promise<import("../typeorm/entities/user.entity").User[]>;
    findOne(id: string): Promise<import("../typeorm/entities/user.entity").User>;
    update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<import("../typeorm/entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
