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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const mysql2_1 = require("drizzle-orm/mysql2");
const drizzle_provider_1 = require("../drizzle/drizzle.provider");
const schema = __importStar(require("../drizzle/schema"));
const drizzle_orm_1 = require("drizzle-orm");
let TagsService = class TagsService {
    constructor(drizzleDb) {
        this.drizzleDb = drizzleDb;
    }
    async create(createTagDto) {
        try {
            const insertData = {
                name: createTagDto.name,
            };
            if (createTagDto.description) {
                insertData.description = createTagDto.description;
            }
            const result = await this.drizzleDb.insert(schema.tags).values(insertData);
            const insertId = Number(result[0].insertId);
            const [tag] = await this.drizzleDb
                .select()
                .from(schema.tags)
                .where((0, drizzle_orm_1.eq)(schema.tags.id, insertId))
                .limit(1);
            if (!tag) {
                throw new Error('Failed to create tag');
            }
            return tag;
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException(`Tag with name "${createTagDto.name}" already exists`);
            }
            throw error;
        }
    }
    async findAll() {
        const tagsData = await this.drizzleDb
            .select()
            .from(schema.tags)
            .orderBy((0, drizzle_orm_1.desc)(schema.tags.createdAt));
        const enrichedTags = await Promise.all(tagsData.map(async (tag) => {
            const [result] = await this.drizzleDb
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(schema.postTags)
                .where((0, drizzle_orm_1.eq)(schema.postTags.tagId, tag.id));
            return {
                ...tag,
                postCount: result?.count || 0,
            };
        }));
        return enrichedTags;
    }
    async findOne(id) {
        const [tag] = await this.drizzleDb
            .select()
            .from(schema.tags)
            .where((0, drizzle_orm_1.eq)(schema.tags.id, id))
            .limit(1);
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with ID ${id} not found`);
        }
        const [result] = await this.drizzleDb
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema.postTags)
            .where((0, drizzle_orm_1.eq)(schema.postTags.tagId, tag.id));
        return {
            ...tag,
            postCount: result?.count || 0,
        };
    }
    async findByName(name) {
        const [tag] = await this.drizzleDb
            .select()
            .from(schema.tags)
            .where((0, drizzle_orm_1.eq)(schema.tags.name, name))
            .limit(1);
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with name "${name}" not found`);
        }
        return tag;
    }
    async update(id, updateData) {
        const tag = await this.findOne(id);
        await this.drizzleDb
            .update(schema.tags)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema.tags.id, id));
        const [updated] = await this.drizzleDb
            .select()
            .from(schema.tags)
            .where((0, drizzle_orm_1.eq)(schema.tags.id, id))
            .limit(1);
        return updated;
    }
    async remove(id) {
        const tag = await this.findOne(id);
        await this.drizzleDb
            .delete(schema.postTags)
            .where((0, drizzle_orm_1.eq)(schema.postTags.tagId, id));
        await this.drizzleDb
            .delete(schema.tags)
            .where((0, drizzle_orm_1.eq)(schema.tags.id, id));
    }
    async getPostsForTag(tagId) {
        await this.findOne(tagId);
        const posts = await this.drizzleDb
            .select()
            .from(schema.postTags)
            .where((0, drizzle_orm_1.eq)(schema.postTags.tagId, tagId));
        return posts;
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_provider_1.DRIZZLE_DB)),
    __metadata("design:paramtypes", [mysql2_1.MySql2Database])
], TagsService);
//# sourceMappingURL=tags.service.js.map