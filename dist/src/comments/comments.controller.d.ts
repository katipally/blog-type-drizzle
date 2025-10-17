import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto): Promise<{
        id: number;
        content: string;
        userId: number;
        postId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByPost(postId: string): Promise<any[]>;
    findByUser(userId: string): Promise<any[]>;
    update(id: string, updateCommentDto: Partial<CreateCommentDto>): Promise<{
        id: number;
        content: string;
        userId: number;
        postId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
