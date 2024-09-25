import { Inject, Injectable, Logger } from "@nestjs/common";

import { EngagementMetrics } from "~/core/entities/engagement-metric.entity";
import { PostComment } from "~/core/entities/post-comment.entity";
import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { User } from "~/core/entities/user.entity";
import { Platform } from "~/core/enums/platform.enum";
import { SocialMediaPostService } from "~/modules/social-media-post/social-media-post.service";

@Injectable()
export class StreamSocialMediaPost {
  private logger = new Logger(StreamSocialMediaPost.name);
  private readonly hashtags: string[] = ["#example", "#test", "#simulation"];
  private readonly maxPostsToGenerate = 10000;
  private readonly postInterval = 10;
  private readonly anomalyPostThreshold = 500;

  @Inject(SocialMediaPostService)
  private readonly socialMediaPostService: SocialMediaPostService;

  async startStreaming() {
    for (let i = 0; i < this.maxPostsToGenerate; i++) {
      const platform = this.getRandomPlatform();
      const user: User = this.generateRandomUser();
      const comments: PostComment[] = this.generateRandomComments();

      const mockPost: Partial<SocialMediaPost> = {
        text: `This is a simulated post number ${i + 1}`,
        timestamp: new Date(),
        hashtags: [this.getRandomHashtag()],
        user: user,
        platform: platform,
        mediaUrl: this.getRandomMediaUrl(),
        comments: comments,
        engagementMetrics: this.generateEngagementMetrics(),
      };

      await this.socialMediaPostService.execute(mockPost);
      console.log(`Generated post number ${i + 1} on ${platform} platform`);

      if (i === this.anomalyPostThreshold) {
        this.logger.warn(`Anomaly detected: Generating posts every second`);
        await this.delay(1000);
      } else {
        await this.delay(this.postInterval);
      }
    }
  }

  private getRandomHashtag(): string {
    return this.hashtags[Math.floor(Math.random() * this.hashtags.length)];
  }

  private getRandomPlatform(): Platform {
    const platforms = [Platform.Twitter, Platform.Facebook, Platform.Instagram, Platform.YouTube];
    return platforms[Math.floor(Math.random() * platforms.length)];
  }

  private generateRandomUser(): User {
    return {
      id: `user${Math.floor(Math.random() * 1000)}`,
      username: `user${Math.floor(Math.random() * 1000)}`,
    };
  }

  private generateRandomComments(): PostComment[] {
    const commentsCount = Math.floor(Math.random() * 5);
    const comments: PostComment[] = [];
    for (let i = 0; i < commentsCount; i++) {
      comments.push({
        user: {
          id: `user${Math.floor(Math.random() * 1000)}`,
          username: `user${Math.floor(Math.random() * 1000)}`,
          profilePictureUrl: `http://example.com/user${Math.floor(Math.random() * 1000)}.jpg`,
        },
        text: `This is a comment number ${i + 1}`,
        timestamp: new Date(),
      });
    }
    return comments;
  }

  private generateEngagementMetrics(): EngagementMetrics {
    return {
      likes: Math.floor(Math.random() * 1000),
      shares: Math.floor(Math.random() * 500),
      views: Math.floor(Math.random() * 10000),
    };
  }

  private getRandomMediaUrl(): string {
    return Math.random() > 0.5 ? `http://example.com/media${Math.floor(Math.random() * 100)}.jpg` : undefined;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
