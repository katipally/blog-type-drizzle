import { DataSource } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { CreateCommentDto } from '../dto/create-comment.dto';
import * as schema from '../drizzle/schema';
export declare class CommentsService {
    private readonly drizzleDb;
    private readonly typeormDataSource;
    constructor(drizzleDb: MySql2Database<typeof schema>, typeormDataSource: DataSource);
    create(createCommentDto: CreateCommentDto): Promise<schema.Comment>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    findByPost(postId: number): Promise<any[]>;
    findByUser(userId: number): Promise<any[]>;
    private enrichCommentWithTypeOrmData;
    update(id: number, updateData: Partial<CreateCommentDto>): Promise<schema.Comment>;
    remove(id: number): Promise<void>;
}
