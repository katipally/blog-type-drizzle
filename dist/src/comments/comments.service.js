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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mysql2_1 = require("drizzle-orm/mysql2");
const drizzle_provider_1 = require("../drizzle/drizzle.provider");
const schema = __importStar(require("../drizzle/schema"));
const drizzle_orm_1 = require("drizzle-orm");
let CommentsService = class CommentsService {
    constructor(drizzleDb, typeormDataSource) {
        this.drizzleDb = drizzleDb;
        this.typeormDataSource = typeormDataSource;
    }
    async create(createCommentDto) {
        const user = await this.typeormDataSource
            .getRepository('User')
            .findOne({ where: { id: createCommentDto.userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${createCommentDto.userId} not found`);
        }
        const post = await this.typeormDataSource
            .getRepository('Post')
            .findOne({ where: { id: createCommentDto.postId } });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${createCommentDto.postId} not found`);
        }
        const result = await this.drizzleDb.insert(schema.comments).values({
            content: createCommentDto.content,
            userId: createCommentDto.userId,
            postId: createCommentDto.postId,
        });
        const insertId = Number(result[0].insertId);
        const [comment] = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.id, insertId))
            .limit(1);
        if (!comment) {
            throw new Error('Failed to create comment');
        }
        return comment;
    }
    async findAll() {
        const commentsData = await this.drizzleDb
            .select()
            .from(schema.comments)
            .orderBy((0, drizzle_orm_1.desc)(schema.comments.createdAt));
        const enrichedComments = await Promise.all(commentsData.map(async (comment) => {
            return await this.enrichCommentWithTypeOrmData(comment);
        }));
        return enrichedComments;
    }
    async findOne(id) {
        const [comment] = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.id, id))
            .limit(1);
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        return await this.enrichCommentWithTypeOrmData(comment);
    }
    async findByPost(postId) {
        const commentsData = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.postId, postId))
            .orderBy((0, drizzle_orm_1.desc)(schema.comments.createdAt));
        const enrichedComments = await Promise.all(commentsData.map(async (comment) => {
            return await this.enrichCommentWithTypeOrmData(comment);
        }));
        return enrichedComments;
    }
    async findByUser(userId) {
        const commentsData = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema.comments.createdAt));
        const enrichedComments = await Promise.all(commentsData.map(async (comment) => {
            return await this.enrichCommentWithTypeOrmData(comment);
        }));
        return enrichedComments;
    }
    async enrichCommentWithTypeOrmData(comment) {
        const user = await this.typeormDataSource
            .getRepository('User')
            .createQueryBuilder('user')
            .select(['user.id', 'user.name', 'user.email'])
            .where('user.id = :userId', { userId: comment.userId })
            .getOne();
        const post = await this.typeormDataSource
            .getRepository('Post')
            .createQueryBuilder('post')
            .select(['post.id', 'post.title'])
            .where('post.id = :postId', { postId: comment.postId })
            .getOne();
        return {
            ...comment,
            author: user,
            post: post,
        };
    }
    async update(id, updateData) {
        const [comment] = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.id, id))
            .limit(1);
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        await this.drizzleDb
            .update(schema.comments)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema.comments.id, id));
        const [updated] = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.id, id))
            .limit(1);
        return updated;
    }
    async remove(id) {
        const [comment] = await this.drizzleDb
            .select()
            .from(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.id, id))
            .limit(1);
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        await this.drizzleDb
            .delete(schema.comments)
            .where((0, drizzle_orm_1.eq)(schema.comments.id, id));
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE_DB)),
    __param(1, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [mysql2_1.MySql2Database,
        typeorm_2.DataSource])
], CommentsService);
//# sourceMappingURL=comments.service.js.map