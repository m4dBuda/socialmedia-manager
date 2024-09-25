import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { SocialMediaPostDocument } from "~/infrastructure/database/nosql/schemas/social-media-post.schema";

@Injectable()
export class AnomalyDetectionService {
  private readonly logger = new Logger(AnomalyDetectionService.name);
  private readonly windowSize = 10; // In minutes
  private readonly defaultThreshold = 0.5; // 50% change for anomaly detection
  private rateHistory: number[] = [];
  private anomalyThreshold = this.defaultThreshold;

  constructor(@InjectModel(SocialMediaPostDocument.name) private postModel: Model<SocialMediaPostDocument>) {}

  async detectAnomalies() {
    setInterval(async () => {
      const now = new Date();
      const past = new Date(now.getTime() - this.windowSize * 60000);

      const posts = await this.postModel.find({
        timestamp: { $gte: past, $lte: now },
      });

      const postCount = posts.length;
      this.rateHistory.push(postCount);

      if (this.rateHistory.length > this.windowSize) {
        this.rateHistory.shift();
      }

      if (this.isAnomalyDetected(posts)) {
        this.triggerAnomalyAlert(posts, postCount);
      }

      this.updateDynamicThreshold();
    }, 60000);
  }

  isAnomalyDetected(posts: SocialMediaPostDocument[]): boolean {
    if (this.rateHistory.length < 2) return false;

    const recentRate = this.rateHistory[this.rateHistory.length - 1];
    const previousRate = this.rateHistory[this.rateHistory.length - 2];
    const rateChange = Math.abs(recentRate - previousRate) / previousRate;

    const hashtagSpike = this.detectHashtagSpike(posts);
    const userActivitySpike = this.detectUserActivitySpike(posts);
    const platformActivitySpike = this.detectPlatformActivitySpike(posts);

    return rateChange > this.anomalyThreshold || hashtagSpike || userActivitySpike || platformActivitySpike;
  }

  detectHashtagSpike(posts: SocialMediaPostDocument[]): boolean {
    const hashtags = posts.flatMap((post) => post.hashtags);
    const uniqueHashtags = new Set(hashtags);
    const hashtagCount = uniqueHashtags.size;

    return hashtagCount > 50;
  }

  detectUserActivitySpike(posts: SocialMediaPostDocument[]): boolean {
    const userPostCounts = posts.reduce((acc: { [key: string]: number }, post) => {
      const userId = post.user.id;
      acc[userId] = (acc[userId] || 0) + 1;
      return acc;
    }, {});

    const maxPostsByUser = Math.max(...Object.values(userPostCounts));

    return maxPostsByUser > 20;
  }

  detectPlatformActivitySpike(posts: SocialMediaPostDocument[]): boolean {
    const platformPostCounts = posts.reduce((acc: { [key: string]: number }, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {});

    const maxPostsByPlatform = Math.max(...Object.values(platformPostCounts));
    return maxPostsByPlatform > 50;
  }

  triggerAnomalyAlert(posts: SocialMediaPostDocument[], postCount: number) {
    const recentRate = this.rateHistory[this.rateHistory.length - 1];
    const previousRate = this.rateHistory[this.rateHistory.length - 2];
    const rateChange = Math.abs(recentRate - previousRate) / previousRate;

    const hashtagSpike = this.detectHashtagSpike(posts);
    const userActivitySpike = this.detectUserActivitySpike(posts);
    const platformActivitySpike = this.detectPlatformActivitySpike(posts);

    const anomalyDetails = {
      message: "Anomaly detected in post rate!",
      recentRate,
      previousRate,
      postCountInCurrentWindow: postCount,
      rateChangePercentage: (rateChange * 100).toFixed(2) + "%",
      timestamp: new Date().toISOString(),
      alertLevel: this.getAlertSeverity(rateChange),
      anomalies: {
        rateChange: rateChange > this.anomalyThreshold,
        hashtagSpike,
        userActivitySpike,
        platformActivitySpike,
      },
    };

    this.logger.warn(anomalyDetails);
  }

  getAlertSeverity(rateChange: number): string {
    if (rateChange > 1.0) return "Critical";
    if (rateChange > 0.75) return "High";
    if (rateChange > 0.5) return "Warning";
    return "Info";
  }

  updateDynamicThreshold() {
    const averageRate = this.rateHistory.reduce((acc, rate) => acc + rate, 0) / this.rateHistory.length;

    if (averageRate > 1000) {
      this.anomalyThreshold = 0.75; // Adjust for high social media post volumes
    } else if (averageRate < 100) {
      this.anomalyThreshold = 0.3; // Lower threshold for low social media post volumes
    } else {
      this.anomalyThreshold = this.defaultThreshold;
    }
  }
}
