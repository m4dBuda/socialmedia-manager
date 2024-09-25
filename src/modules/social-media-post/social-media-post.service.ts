import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { SocialMediaPostUseCase } from "~/core/use-cases/social-media-post.use-case";
import { SocialMediaPostDocument } from "~/infrastructure/database/nosql/schemas/social-media-post.schema";

import { AnomalyDetectionService } from "../anomaly/anomaly.service";

@Injectable()
export class SocialMediaPostService {
  @InjectModel(SocialMediaPost.name)
  private socialMediaPostModel: Model<SocialMediaPostDocument>;

  @Inject(AnomalyDetectionService)
  private anomalyDetectionService: AnomalyDetectionService;

  @Inject(SocialMediaPostUseCase)
  private socialMediaPostUseCase: SocialMediaPostUseCase;

  private readonly maxPosts = Number(process.env.MAX_POST_LIMIT);
  private postRateHistory: number[] = [];

  async execute(data: Partial<SocialMediaPost>): Promise<void> {
    await this.storeSocialMediaPost(data);
    await this.monitorPostRate();
  }

  private async storeSocialMediaPost(data: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    await this.socialMediaPostUseCase.limitToMaxPosts(this.maxPosts);
    const createdPost = new this.socialMediaPostModel(data);
    return createdPost.save();
  }

  private async monitorPostRate() {
    const postsInLastMinute = await this.socialMediaPostModel
      .find({
        timestamp: { $gte: new Date(Date.now() - 60000) },
      })
      .exec();

    const postCount = postsInLastMinute.length;
    this.postRateHistory.push(postCount);

    if (this.postRateHistory.length > 10) {
      this.postRateHistory.shift();
    }

    await this.anomalyDetectionService.detectAnomalies(postsInLastMinute, postCount);
  }
}
