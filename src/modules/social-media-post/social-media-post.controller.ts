import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { SocialMediaPostUseCase } from "~/core/use-cases/social-media-post.use-case";

@ApiTags("social-media-post")
@Controller("social-media-post")
export class SocialMediaPostController {
  @Inject(SocialMediaPostUseCase)
  private socialMediaPostUseCase: SocialMediaPostUseCase;

  @Post()
  @ApiOperation({ summary: "Create a new social media post" })
  @ApiBody({ type: SocialMediaPost })
  @ApiResponse({ status: 201, description: "The post has been successfully created." })
  @ApiResponse({ status: 400, description: "Invalid input." })
  public async storeSocialMediaPost(@Body() data: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    return this.socialMediaPostUseCase.create(data);
  }

  @Get()
  @ApiOperation({ summary: "Get all social media posts with pagination and filters" })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of items per page" })
  @ApiQuery({ name: "user", required: false, type: String, description: "Filter by user" })
  @ApiQuery({ name: "platform", required: false, type: String, description: "Filter by platform" })
  @ApiQuery({ name: "hashtag", required: false, type: String, description: "Filter by hashtag" })
  @ApiResponse({ status: 200, description: "List of social media posts." })
  public async findAllSocialMediaPost(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("user") user?: string,
    @Query("platform") platform?: string,
    @Query("hashtag") hashtag?: string,
  ): Promise<SocialMediaPost[]> {
    const filters = { user, platform, hashtag };
    return this.socialMediaPostUseCase.findAll({ page, limit, filters });
  }

  @Get("search")
  @ApiOperation({ summary: "Search social media posts by hashtag with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of items per page" })
  @ApiQuery({ name: "hashtag", required: true, type: String, description: "Hashtag to search for" })
  @ApiResponse({ status: 200, description: "List of social media posts matching the hashtag." })
  public async findSocialMediaPostByHashtag(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("hashtag") hashtag: string,
  ): Promise<SocialMediaPost[]> {
    return this.socialMediaPostUseCase.findByHashtag({ page, limit, hashtag });
  }
}
