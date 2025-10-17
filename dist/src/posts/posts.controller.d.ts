import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto): Promise<import("../typeorm/entities/post.entity").Post>;
    findAll(): Promise<import("../typeorm/entities/post.entity").Post[]>;
    findOne(id: string): Promise<import("../typeorm/entities/post.entity").Post>;
    findOneWithDetails(id: string): Promise<any>;
    findByAuthor(authorId: string): Promise<import("../typeorm/entities/post.entity").Post[]>;
    linkToTag(postId: string, tagId: string): Promise<{
        message: string;
    }>;
    getPostTags(id: string): Promise<any[]>;
    update(id: string, updatePostDto: Partial<CreatePostDto>): Promise<import("../typeorm/entities/post.entity").Post>;
    remove(id: string): Promise<void>;
}
