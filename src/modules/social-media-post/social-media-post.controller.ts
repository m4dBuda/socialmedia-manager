import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { SocialMediaPostUseCase } from "~/core/use-cases/social-media-post.use-case";

@Controller("tweets")
export class SocialMediaPostController {
  @Inject(SocialMediaPostUseCase)
  private socialMediaPostUseCase: SocialMediaPostUseCase;

  @Post()
  public async storeSocialMediaPost(@Body() tweetData: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    return this.socialMediaPostUseCase.create(tweetData);
  }

  @Get()
  public async findAllSocialMediaPost(): Promise<SocialMediaPost[]> {
    return this.socialMediaPostUseCase.findAll();
  }

  @Get("search")
  public async findSocialMediaPostByHashtag(@Query("hashtag") hashtag: string): Promise<SocialMediaPost[]> {
    return this.socialMediaPostUseCase.findByHashtag(hashtag);
  }
}
