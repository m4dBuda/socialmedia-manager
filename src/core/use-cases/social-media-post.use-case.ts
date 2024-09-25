import { Inject } from "@nestjs/common";

import { MongoSocialMediaPostRepository } from "~/infrastructure/database/nosql/repositories/social-media-post.repository";

import { SocialMediaPost } from "../entities/social-media-post.entity";
import { ISocialMediaPostRepository } from "../interfaces/social-media-post-repository.interface";

export class SocialMediaPostUseCase implements ISocialMediaPostRepository {
  @Inject(MongoSocialMediaPostRepository)
  private socialMediaPostRepository: MongoSocialMediaPostRepository;

  public async create(data: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    return this.socialMediaPostRepository.create(data);
  }

  public async findAll({
    page,
    limit,
    filters,
  }: {
    page: number;
    limit: number;
    filters: any;
  }): Promise<SocialMediaPost[]> {
    const skip = (page - 1) * limit;
    return this.socialMediaPostRepository.findAll({ skip, limit, filters });
  }

  public async findByHashtag({
    page,
    limit,
    hashtag,
  }: {
    page: number;
    limit: number;
    hashtag: string;
  }): Promise<SocialMediaPost[]> {
    const skip = (page - 1) * limit;
    return this.socialMediaPostRepository.findByHashtag({ skip, limit, hashtag });
  }

  public async archiveOldPosts(cutoffDate: Date): Promise<void> {
    return this.socialMediaPostRepository.archiveOldPosts(cutoffDate);
  }

  public async limitToMaxPosts(maxPosts: number): Promise<void> {
    return this.socialMediaPostRepository.limitToMaxPosts(maxPosts);
  }
}
