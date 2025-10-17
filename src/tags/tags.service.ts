import { Injectable, NotFoundException, Inject, ConflictException } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { CreateTagDto } from '../dto/create-tag.dto';
import { DRIZZLE_DB } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { eq, desc, count } from 'drizzle-orm';

@Injectable()
export class TagsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: MySql2Database<typeof schema>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<schema.Tag> {
    try {
      const insertData: any = {
        name: createTagDto.name,
      };
      
      if (createTagDto.description) {
        insertData.description = createTagDto.description;
      }
      
      const result = await this.drizzleDb.insert(schema.tags).values(insertData);

      // Fetch the created tag
      const insertId = Number(result[0].insertId);
      const [tag] = await this.drizzleDb
        .select()
        .from(schema.tags)
        .where(eq(schema.tags.id, insertId))
        .limit(1);

      if (!tag) {
        throw new Error('Failed to create tag');
      }

      return tag;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Tag with name "${createTagDto.name}" already exists`);
      }
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    const tagsData = await this.drizzleDb
      .select()
      .from(schema.tags)
      .orderBy(desc(schema.tags.createdAt));

    // Get post count for each tag
    const enrichedTags = await Promise.all(
      tagsData.map(async (tag) => {
        const [result] = await this.drizzleDb
          .select({ count: count() })
          .from(schema.postTags)
          .where(eq(schema.postTags.tagId, tag.id));

        return {
          ...tag,
          postCount: result?.count || 0,
        };
      })
    );

    return enrichedTags;
  }

  async findOne(id: number): Promise<any> {
    const [tag] = await this.drizzleDb
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.id, id))
      .limit(1);

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    // Get post count
    const [result] = await this.drizzleDb
      .select({ count: count() })
      .from(schema.postTags)
      .where(eq(schema.postTags.tagId, tag.id));

    return {
      ...tag,
      postCount: result?.count || 0,
    };
  }

  async findByName(name: string): Promise<schema.Tag> {
    const [tag] = await this.drizzleDb
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, name))
      .limit(1);

    if (!tag) {
      throw new NotFoundException(`Tag with name "${name}" not found`);
    }

    return tag;
  }

  async update(id: number, updateData: Partial<CreateTagDto>): Promise<schema.Tag> {
    const tag = await this.findOne(id);

    await this.drizzleDb
      .update(schema.tags)
      .set(updateData)
      .where(eq(schema.tags.id, id));

    const [updated] = await this.drizzleDb
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.id, id))
      .limit(1);

    return updated;
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);

    // Remove tag associations first
    await this.drizzleDb
      .delete(schema.postTags)
      .where(eq(schema.postTags.tagId, id));

    // Then remove the tag
    await this.drizzleDb
      .delete(schema.tags)
      .where(eq(schema.tags.id, id));
  }

  async getPostsForTag(tagId: number): Promise<any[]> {
    await this.findOne(tagId); // Verify tag exists

    const posts = await this.drizzleDb
      .select()
      .from(schema.postTags)
      .where(eq(schema.postTags.tagId, tagId));

    return posts;
  }
}
