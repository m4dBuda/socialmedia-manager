import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { SocialMediaPostDocument } from "~/infrastructure/database/nosql/schemas/social-media-post.schema";

@Injectable()
export class SocialMediaPostService {
  private readonly logger = new Logger(SocialMediaPostService.name);
  private readonly maxPosts = 100000;
  private postRateHistory: number[] = [];

  constructor(@InjectModel(SocialMediaPost.name) private socialMediaPostModel: Model<SocialMediaPostDocument>) {}

  async execute(data: Partial<SocialMediaPost>): Promise<void> {
    await this.storeSocialMediaPost(data);
    await this.monitorPostRate();
  }

  private async storeSocialMediaPost(data: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    const count = await this.socialMediaPostModel.countDocuments().exec();

    if (count >= this.maxPosts) {
      await this.archiveOldPosts();
    }

    const createdPost = new this.socialMediaPostModel(data);
    return createdPost.save();
  }

  private async archiveOldPosts() {
    const oldestPost = await this.socialMediaPostModel.findOne().sort({ timestamp: 1 }).exec();
    if (oldestPost) {
      await this.socialMediaPostModel.deleteOne({ _id: oldestPost._id });
      this.logger.log("Archived an old post");
    }
  }

  private async monitorPostRate() {
    const postsInLastMinute = await this.socialMediaPostModel
      .countDocuments({
        timestamp: { $gte: new Date(Date.now() - 60000) },
      })
      .exec();

    this.postRateHistory.push(postsInLastMinute);

    if (this.postRateHistory.length > 10) {
      this.postRateHistory.shift();
    }

    if (this.isAnomalyDetected()) {
      this.triggerAnomalyAlert();
    }
  }

  private isAnomalyDetected(): boolean {
    if (this.postRateHistory.length < 2) return false;

    const recentRate = this.postRateHistory[this.postRateHistory.length - 1];
    const previousRate = this.postRateHistory[this.postRateHistory.length - 2];

    const rateChange = Math.abs(recentRate - previousRate) / previousRate;

    return rateChange > 0.5;
  }

  private triggerAnomalyAlert() {
    const recentRate = this.postRateHistory[this.postRateHistory.length - 1];
    const previousRate = this.postRateHistory[this.postRateHistory.length - 2];
    const rateChange = Math.abs(recentRate - previousRate) / previousRate;

    const anomalyDetails = {
      message: "Anomaly detected in post rate!",
      recentRate,
      previousRate,
      rateChangePercentage: (rateChange * 100).toFixed(2) + "%",
      timestamp: new Date().toISOString(),
    };

    this.logger.warn(anomalyDetails);
  }
}
