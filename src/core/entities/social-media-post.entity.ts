import { Platform } from "../enums/platform.enum";
import { EngagementMetrics } from "./engagement-metric.entity";
import { PostComment } from "./post-comment.entity";
import { User } from "./user.entity";

export class SocialMediaPost {
  id?: string;
  text: string;
  timestamp: Date;
  hashtags: string[];
  user: User;
  platform: Platform;
  mediaUrl?: string;
  comments?: PostComment[];
  engagementMetrics?: EngagementMetrics;
}
