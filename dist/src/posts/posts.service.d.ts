import { Repository } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Post } from '../typeorm/entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import * as schema from '../drizzle/schema';
export declare class PostsService {
    private readonly postRepository;
    private readonly drizzleDb;
    constructor(postRepository: Repository<Post>, drizzleDb: MySql2Database<typeof schema>);
    create(createPostDto: CreatePostDto): Promise<Post>;
    addTagsToPost(postId: number, tagIds: number[]): Promise<void>;
    findAll(): Promise<Post[]>;
    findOne(id: number): Promise<Post>;
    findOneWithDetails(id: number): Promise<any>;
    private enrichPostWithDrizzleData;
    update(id: number, updateData: Partial<CreatePostDto>): Promise<Post>;
    remove(id: number): Promise<void>;
    findByAuthor(authorId: number): Promise<Post[]>;
    linkToTag(postId: number, tagId: number): Promise<{
        message: string;
    }>;
    getPostTags(postId: number): Promise<any[]>;
}
