import { TagsService } from './tags.service';
import { CreateTagDto } from '../dto/create-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(createTagDto: CreateTagDto): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByName(name: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }>;
    getPostsForTag(id: string): Promise<any[]>;
    update(id: string, updateTagDto: Partial<CreateTagDto>): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
    }>;
    remove(id: string): Promise<void>;
}
