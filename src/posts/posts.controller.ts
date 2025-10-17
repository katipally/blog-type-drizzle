import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Get(':id/details')
  findOneWithDetails(@Param('id') id: string) {
    return this.postsService.findOneWithDetails(+id);
  }

  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.postsService.findByAuthor(+authorId);
  }

  @Post(':postId/tags/:tagId')
  linkToTag(@Param('postId') postId: string, @Param('tagId') tagId: string) {
    return this.postsService.linkToTag(+postId, +tagId);
  }

  @Get(':id/tags')
  getPostTags(@Param('id') id: string) {
    return this.postsService.getPostTags(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: Partial<CreatePostDto>) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
