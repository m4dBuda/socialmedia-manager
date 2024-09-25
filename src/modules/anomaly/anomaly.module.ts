import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  SocialMediaPostDocument,
  SocialMediaPostSchema,
} from "~/infrastructure/database/nosql/schemas/social-media-post.schema";

import { AnomalyDetectionService } from "./anomaly.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: SocialMediaPostDocument.name, schema: SocialMediaPostSchema }])],
  providers: [AnomalyDetectionService],
  exports: [AnomalyDetectionService],
})
export class AnomalyModule implements OnModuleInit {
  @Inject(AnomalyDetectionService)
  private readonly anomalyDetectionService: AnomalyDetectionService;

  async onModuleInit() {
    await this.anomalyDetectionService.detectAnomalies();
  }
}
