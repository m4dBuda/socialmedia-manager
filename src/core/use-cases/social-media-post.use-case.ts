import { Inject } from "@nestjs/common";

import { MongoSocialMediaPostRepository } from "~/infrastructure/database/nosql/repositories/social-media-post.repository";

import { SocialMediaPost } from "../entities/social-media-post.entity";
import { ISocialMediaPostRepository } from "../interfaces/social-media-post-repository.interface";

export class SocialMediaPostUseCase implements ISocialMediaPostRepository {
  @Inject(MongoSocialMediaPostRepository)
  private socialMediaPostRepository: MongoSocialMediaPostRepository;

  public async create(post: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    return this.socialMediaPostRepository.create(post);
  }

  public async findAll(): Promise<SocialMediaPost[]> {
    return this.socialMediaPostRepository.findAll();
  }

  public async findByHashtag(hashtag: string): Promise<SocialMediaPost[]> {
    return this.socialMediaPostRepository.findByHashtag(hashtag);
  }

  public async archiveOldPosts(cutoffDate: Date): Promise<void> {
    return this.socialMediaPostRepository.archiveOldPosts(cutoffDate);
  }

  public async limitToMaxPosts(maxPosts: number): Promise<void> {
    return this.socialMediaPostRepository.limitToMaxPosts(maxPosts);
  }
}
