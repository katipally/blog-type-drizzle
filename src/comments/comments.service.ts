import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { DRIZZLE_DB } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: MySql2Database<typeof schema>,
    @InjectDataSource()
    private readonly typeormDataSource: DataSource,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<schema.Comment> {
    // CROSS-ORM INTERACTION: Verify user and post exist in TypeORM
    const user = await this.typeormDataSource
      .getRepository('User')
      .findOne({ where: { id: createCommentDto.userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${createCommentDto.userId} not found`);
    }

    const post = await this.typeormDataSource
      .getRepository('Post')
      .findOne({ where: { id: createCommentDto.postId } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${createCommentDto.postId} not found`);
    }

    // Create comment using Drizzle
    const result = await this.drizzleDb.insert(schema.comments).values({
      content: createCommentDto.content,
      userId: createCommentDto.userId,
      postId: createCommentDto.postId,
    });
    
    // Fetch the created comment
    const insertId = Number(result[0].insertId);
    const [comment] = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.id, insertId))
      .limit(1);
    
    if (!comment) {
      throw new Error('Failed to create comment');
    }
    
    return comment;
  }

  async findAll(): Promise<any[]> {
    const commentsData = await this.drizzleDb
      .select()
      .from(schema.comments)
      .orderBy(desc(schema.comments.createdAt));

    // CROSS-ORM INTERACTION: Enrich with TypeORM data
    const enrichedComments = await Promise.all(
      commentsData.map(async (comment) => {
        return await this.enrichCommentWithTypeOrmData(comment);
      })
    );

    return enrichedComments;
  }

  async findOne(id: number): Promise<any> {
    const [comment] = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.id, id))
      .limit(1);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return await this.enrichCommentWithTypeOrmData(comment);
  }

  async findByPost(postId: number): Promise<any[]> {
    const commentsData = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.postId, postId))
      .orderBy(desc(schema.comments.createdAt));

    const enrichedComments = await Promise.all(
      commentsData.map(async (comment) => {
        return await this.enrichCommentWithTypeOrmData(comment);
      })
    );

    return enrichedComments;
  }

  async findByUser(userId: number): Promise<any[]> {
    const commentsData = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.userId, userId))
      .orderBy(desc(schema.comments.createdAt));

    const enrichedComments = await Promise.all(
      commentsData.map(async (comment) => {
        return await this.enrichCommentWithTypeOrmData(comment);
      })
    );

    return enrichedComments;
  }

  private async enrichCommentWithTypeOrmData(comment: schema.Comment): Promise<any> {
    // CROSS-ORM INTERACTION: Fetch user data from TypeORM
    const user = await this.typeormDataSource
      .getRepository('User')
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email'])
      .where('user.id = :userId', { userId: comment.userId })
      .getOne();

    // CROSS-ORM INTERACTION: Fetch post data from TypeORM
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

  async update(id: number, updateData: Partial<CreateCommentDto>): Promise<schema.Comment> {
    const [comment] = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.id, id))
      .limit(1);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.drizzleDb
      .update(schema.comments)
      .set(updateData)
      .where(eq(schema.comments.id, id));

    const [updated] = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.id, id))
      .limit(1);

    return updated;
  }

  async remove(id: number): Promise<void> {
    const [comment] = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.id, id))
      .limit(1);

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.drizzleDb
      .delete(schema.comments)
      .where(eq(schema.comments.id, id));
  }
}
