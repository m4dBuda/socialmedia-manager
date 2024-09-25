import { SocialMediaPost } from "../entities/social-media-post.entity";

export interface ISocialMediaPostRepository {
  create(post: Partial<SocialMediaPost>): Promise<SocialMediaPost>;
  findAll({ page, limit }: { page: number; limit: number }): Promise<SocialMediaPost[]>;
  findByHashtag({ page, limit, hashtag }: { page: number; limit: number; hashtag: string }): Promise<SocialMediaPost[]>;
  archiveOldPosts(cutoffDate: Date): Promise<void>;
  limitToMaxPosts(maxPosts: number): Promise<void>;
}
