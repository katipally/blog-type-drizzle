import { MySql2Database } from 'drizzle-orm/mysql2';
import { CreateTagDto } from '../dto/create-tag.dto';
import * as schema from '../drizzle/schema';
export declare class TagsService {
    private readonly drizzleDb;
    constructor(drizzleDb: MySql2Database<typeof schema>);
    create(createTagDto: CreateTagDto): Promise<schema.Tag>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    findByName(name: string): Promise<schema.Tag>;
    update(id: number, updateData: Partial<CreateTagDto>): Promise<schema.Tag>;
    remove(id: number): Promise<void>;
    getPostsForTag(tagId: number): Promise<any[]>;
}
