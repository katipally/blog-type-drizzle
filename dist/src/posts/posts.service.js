"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mysql2_1 = require("drizzle-orm/mysql2");
const post_entity_1 = require("../typeorm/entities/post.entity");
const drizzle_provider_1 = require("../drizzle/drizzle.provider");
const schema = __importStar(require("../drizzle/schema"));
const drizzle_orm_1 = require("drizzle-orm");
let PostsService = class PostsService {
    constructor(postRepository, drizzleDb) {
        this.postRepository = postRepository;
        this.drizzleDb = drizzleDb;
    }
    async create(createPostDto) {
        const { tagIds, ...postData } = createPostDto;
        const post = this.postRepository.create(postData);
        const savedPost = await this.postRepository.save(post);
        if (tagIds && tagIds.length > 0) {
            await this.addTagsToPost(savedPost.id, tagIds);
        }
        return savedPost;
    }
    async addTagsToPost(postId, tagIds) {
        for (const tagId of tagIds) {
            try {
                await this.drizzleDb.insert(schema.postTags).values({
                    postId,
                    tagId,
                });
            }
            catch (error) {
                if (error.code !== 'ER_DUP_ENTRY') {
                    throw error;
                }
            }
        }
    }
    async findAll() {
        const posts = await this.postRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
        for (const post of posts) {
            await this.enrichPostWithDrizzleData(post);
        }
        return posts;
    }
    async findOne(id) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        await this.enrichPostWithDrizzleData(post);
        return post;
    }
    async findOneWithDetails(id) {
        const post = await this.findOne(id);
        const commentsData = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.postId, id));
        const tagsData = await this.drizzleDb
            .select({
            id: schema.tags.id,
            name: schema.tags.name,
            description: schema.tags.description,
        })
            .from(schema.tags)
            .innerJoin(schema.postTags, (0, drizzle_orm_1.eq)(schema.postTags.tagId, schema.tags.id))
            .where((0, drizzle_orm_1.eq)(schema.postTags.postId, id));
        return {
            ...post,
            comments: commentsData,
            tags: tagsData,
        };
    }
    async enrichPostWithDrizzleData(post) {
        const [commentResult] = await this.drizzleDb
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.postId, post.id));
        post.commentCount = commentResult?.count || 0;
        const tagsData = await this.drizzleDb
            .select({
            id: schema.tags.id,
            name: schema.tags.name,
        })
            .from(schema.tags)
            .innerJoin(schema.postTags, (0, drizzle_orm_1.eq)(schema.postTags.tagId, schema.tags.id))
            .where((0, drizzle_orm_1.eq)(schema.postTags.postId, post.id));
        post.tags = tagsData;
        post.tagCount = tagsData.length;
    }
    async update(id, updateData) {
        const { tagIds, ...postData } = updateData;
        const post = await this.findOne(id);
        Object.assign(post, postData);
        const updated = await this.postRepository.save(post);
        if (tagIds !== undefined) {
            await this.drizzleDb
                .delete(schema.postTags)
                .where((0, drizzle_orm_1.eq)(schema.postTags.postId, id));
            if (tagIds.length > 0) {
                await this.addTagsToPost(id, tagIds);
            }
        }
        return updated;
    }
    async remove(id) {
        const post = await this.findOne(id);
        await this.postRepository.remove(post);
    }
    async findByAuthor(authorId) {
        const posts = await this.postRepository.find({
            where: { authorId },
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
        for (const post of posts) {
            await this.enrichPostWithDrizzleData(post);
        }
        return posts;
    }
    async linkToTag(postId, tagId) {
        await this.findOne(postId);
        const [tag] = await this.drizzleDb
            .select()
            .from(schema.tags)
            .where((0, drizzle_orm_1.eq)(schema.tags.id, tagId))
            .limit(1);
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with ID ${tagId} not found`);
        }
        try {
            await this.drizzleDb.insert(schema.postTags).values({
                postId,
                tagId,
            });
        }
        catch (error) {
            if (error.code !== 'ER_DUP_ENTRY') {
                throw error;
            }
        }
        return { message: `Post ${postId} linked to tag ${tagId}` };
    }
    async getPostTags(postId) {
        await this.findOne(postId);
        const tagsData = await this.drizzleDb
            .select()
            .from(schema.tags)
            .innerJoin(schema.postTags, (0, drizzle_orm_1.eq)(schema.postTags.tagId, schema.tags.id))
            .where((0, drizzle_orm_1.eq)(schema.postTags.postId, postId));
        return tagsData;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE_DB)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mysql2_1.MySql2Database])
], PostsService);
//# sourceMappingURL=posts.service.js.map