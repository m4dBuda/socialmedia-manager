import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { SocialMediaPostDocument } from "~/infrastructure/database/nosql/schemas/social-media-post.schema";

import { AnomalyDetectionService } from "../anomaly/anomaly.service";

@Injectable()
export class SocialMediaPostService {
  @InjectModel(SocialMediaPost.name)
  private socialMediaPostModel: Model<SocialMediaPostDocument>;

  @Inject(AnomalyDetectionService)
  private anomalyDetectionService: AnomalyDetectionService;

  private readonly logger = new Logger(SocialMediaPostService.name);
  private readonly maxPosts = 100000;
  private postRateHistory: number[] = [];

  async execute(data: Partial<SocialMediaPost>): Promise<void> {
    const createdPost = (await this.storeSocialMediaPost(data)) as SocialMediaPostDocument;
    await this.monitorPostRate(createdPost);
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

  private async monitorPostRate(createdPost: SocialMediaPostDocument) {
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
