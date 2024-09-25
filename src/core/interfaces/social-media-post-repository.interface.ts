import { SocialMediaPost } from "../entities/social-media-post.entity";

export interface ISocialMediaPostRepository {
  create(post: Partial<SocialMediaPost>): Promise<SocialMediaPost>;
  findAll(): Promise<SocialMediaPost[]>;
  findByHashtag(hashtag: string): Promise<SocialMediaPost[]>;
  archiveOldPosts(cutoffDate: Date): Promise<void>;
  limitToMaxPosts(maxPosts: number): Promise<void>;
}
