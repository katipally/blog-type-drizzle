import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { Post } from '../typeorm/entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { DRIZZLE_DB } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { eq, count, and } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @Inject(DRIZZLE_DB)
    private readonly drizzleDb: MySql2Database<typeof schema>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { tagIds, ...postData } = createPostDto;
    
    // Create post using TypeORM
    const post = this.postRepository.create(postData);
    const savedPost = await this.postRepository.save(post);

    // CROSS-ORM INTERACTION: Add tags using Drizzle
    if (tagIds && tagIds.length > 0) {
      await this.addTagsToPost(savedPost.id, tagIds);
    }

    return savedPost;
  }

  async addTagsToPost(postId: number, tagIds: number[]): Promise<void> {
    // CROSS-ORM INTERACTION: Insert into post_tags using Drizzle
    for (const tagId of tagIds) {
      try {
        await this.drizzleDb.insert(schema.postTags).values({
          postId,
          tagId,
        });
      } catch (error) {
        // Ignore duplicate key errors (ER_DUP_ENTRY)
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    // CROSS-ORM INTERACTION: Enrich with Drizzle data
    for (const post of posts) {
      await this.enrichPostWithDrizzleData(post);
    }

    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // CROSS-ORM INTERACTION: Enrich with Drizzle data
    await this.enrichPostWithDrizzleData(post);

    return post;
  }

  async findOneWithDetails(id: number): Promise<any> {
    const post = await this.findOne(id);

    // CROSS-ORM INTERACTION: Fetch full comments and tags from Drizzle
    const commentsData = await this.drizzleDb
      .select()
      .from(schema.comments)
      .where(eq(schema.comments.postId, id));

    // Get tags for this post
    const tagsData = await this.drizzleDb
      .select({
        id: schema.tags.id,
        name: schema.tags.name,
        description: schema.tags.description,
      })
      .from(schema.tags)
      .innerJoin(schema.postTags, eq(schema.postTags.tagId, schema.tags.id))
      .where(eq(schema.postTags.postId, id));

    return {
      ...post,
      comments: commentsData,
      tags: tagsData,
    };
  }

  private async enrichPostWithDrizzleData(post: Post): Promise<void> {
    // Get comment count
    const [commentResult] = await this.drizzleDb
      .select({ count: count() })
      .from(schema.comments)
      .where(eq(schema.comments.postId, post.id));
    
    post.commentCount = commentResult?.count || 0;

    // Get tags
    const tagsData = await this.drizzleDb
      .select({
        id: schema.tags.id,
        name: schema.tags.name,
      })
      .from(schema.tags)
      .innerJoin(schema.postTags, eq(schema.postTags.tagId, schema.tags.id))
      .where(eq(schema.postTags.postId, post.id));
    
    post.tags = tagsData;
    post.tagCount = tagsData.length;
  }

  async update(id: number, updateData: Partial<CreatePostDto>): Promise<Post> {
    const { tagIds, ...postData } = updateData;
    const post = await this.findOne(id);
    
    Object.assign(post, postData);
    const updated = await this.postRepository.save(post);

    // CROSS-ORM INTERACTION: Update tags if provided
    if (tagIds !== undefined) {
      // Remove existing tags
      await this.drizzleDb
        .delete(schema.postTags)
        .where(eq(schema.postTags.postId, id));
      
      // Add new tags
      if (tagIds.length > 0) {
        await this.addTagsToPost(id, tagIds);
      }
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
    // Note: Comments and post_tags should be cleaned up with foreign keys or manually
  }

  async findByAuthor(authorId: number): Promise<Post[]> {
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

  // CROSS-ORM: Link post to tag
  async linkToTag(postId: number, tagId: number): Promise<{ message: string }> {
    // Verify post exists (TypeORM)
    await this.findOne(postId);
    
    // Verify tag exists (Drizzle)
    const [tag] = await this.drizzleDb
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.id, tagId))
      .limit(1);
    
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    // Link them
    try {
      await this.drizzleDb.insert(schema.postTags).values({
        postId,
        tagId,
      });
    } catch (error) {
      // Ignore if already linked
      if (error.code !== 'ER_DUP_ENTRY') {
        throw error;
      }
    }

    return { message: `Post ${postId} linked to tag ${tagId}` };
  }

  // Get all tags for a post
  async getPostTags(postId: number): Promise<any[]> {
    await this.findOne(postId); // Verify post exists
    
    const tagsData = await this.drizzleDb
      .select()
      .from(schema.tags)
      .innerJoin(schema.postTags, eq(schema.postTags.tagId, schema.tags.id))
      .where(eq(schema.postTags.postId, postId));

    return tagsData;
  }
}
