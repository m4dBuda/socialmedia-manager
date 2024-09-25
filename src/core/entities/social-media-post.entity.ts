import { ApiProperty } from "@nestjs/swagger";

import { Platform } from "../enums/platform.enum";
import { EngagementMetrics } from "./engagement-metric.entity";
import { PostComment } from "./post-comment.entity";
import { User } from "./user.entity";

export class SocialMediaPost {
  @ApiProperty({ type: String })
  id?: string;

  @ApiProperty({ type: String })
  text: string;

  @ApiProperty({ type: Date })
  timestamp: Date;

  @ApiProperty({ type: [String] })
  hashtags: string[];

  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ enum: Platform })
  platform: Platform;

  @ApiProperty({ type: String })
  mediaUrl?: string;

  @ApiProperty({ type: [PostComment] })
  comments?: PostComment[];

  @ApiProperty({ type: EngagementMetrics })
  engagementMetrics?: EngagementMetrics;
}
