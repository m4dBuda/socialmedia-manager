import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { EngagementMetrics } from "~/core/entities/engagement-metric.entity";
import { PostComment } from "~/core/entities/post-comment.entity";
import { User } from "~/core/entities/user.entity";
import { Platform } from "~/core/enums/platform.enum";

@Schema()
export class SocialMediaPostDocument extends Document {
  @Prop({ required: false })
  id?: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: [String], default: [] })
  hashtags: string[];

  @Prop({ type: Object, required: true })
  user: User;

  @Prop({ required: true, enum: Platform })
  platform: Platform;

  @Prop({ required: false })
  mediaUrl?: string;

  @Prop({ type: [Object], default: [] })
  comments?: PostComment[];

  @Prop({ type: Object, required: false })
  engagementMetrics?: EngagementMetrics;
}

export const SocialMediaPostSchema = SchemaFactory.createForClass(SocialMediaPostDocument);
