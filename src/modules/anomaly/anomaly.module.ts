import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { SocialMediaPostSchema } from "~/infrastructure/database/nosql/schemas/social-media-post.schema";

import { AnomalyDetectionService } from "./anomaly.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: SocialMediaPost.name, schema: SocialMediaPostSchema }])],
  providers: [AnomalyDetectionService],
  exports: [AnomalyDetectionService],
})
export class AnomalyModule {}
