import { Test, TestingModule } from "@nestjs/testing";

import { EngagementMetrics } from "~/core/entities/engagement-metric.entity";

import { User } from "../../core/entities/user.entity";
import { Platform } from "../../core/enums/platform.enum";
import { SocialMediaPostDocument } from "../../infrastructure/database/nosql/schemas/social-media-post.schema";
import { AnomalyDetectionService } from "../../modules/anomaly/anomaly.service";

describe("AnomalyDetectionService", () => {
  let service: AnomalyDetectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnomalyDetectionService],
    }).compile();

    service = module.get<AnomalyDetectionService>(AnomalyDetectionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should detect an anomaly based on rate change", async () => {
    const posts: SocialMediaPostDocument[] = [
      {
        text: "Anomaly test post 1",
        hashtags: ["#test", "#anomaly"],
        user: { id: "user1", username: "User1" } as User,
        platform: Platform.Twitter,
        timestamp: new Date(),
        engagementMetrics: { likes: 10, shares: 5, comments: 2 } as EngagementMetrics,
        comments: Array.from({ length: 5 }, (_, i) => ({
          user: { id: `commenter${i}`, username: `Commenter${i}` } as User,
          timestamp: new Date(),
          text: "Great post!",
        })),
      } as SocialMediaPostDocument,
      {
        text: "Anomaly test post 2",
        hashtags: ["#test", "#anomaly"],
        user: { id: "user2", username: "User2" } as User,
        platform: Platform.Twitter,
        timestamp: new Date(),
        engagementMetrics: { likes: 15, shares: 7, comments: 3 } as EngagementMetrics,
        comments: Array.from({ length: 5 }, (_, i) => ({
          user: { id: `commenter${i}`, username: `Commenter${i}` } as User,
          timestamp: new Date(),
          text: "Great post!",
        })),
      } as SocialMediaPostDocument,
    ];

    service["rateHistory"] = [10, 20, 30, 40, 50];
    const postCount = 200;

    const isAnomalyDetectedSpy = jest.spyOn(service, "isAnomalyDetected");
    const triggerAnomalyAlertSpy = jest.spyOn(service, "triggerAnomalyAlert");

    await service.detectAnomalies(posts, postCount);

    expect(isAnomalyDetectedSpy).toHaveBeenCalledWith(posts);
    expect(triggerAnomalyAlertSpy).toHaveBeenCalledWith(posts, postCount);
  });

  it("should not detect an anomaly if rate history is less than 2", async () => {
    const posts: SocialMediaPostDocument[] = [
      {
        text: "Single post",
        hashtags: ["#test"],
        user: { id: "user1", username: "User1" } as User,
        platform: Platform.Twitter,
        timestamp: new Date(),
        engagementMetrics: { likes: 5, shares: 2, comments: 1 } as EngagementMetrics,
        comments: Array.from({ length: 5 }, (_, i) => ({
          user: { id: `commenter${i}`, username: `Commenter${i}` } as User,
          timestamp: new Date(),
          text: "Nice post!",
        })),
      } as SocialMediaPostDocument,
    ];

    service["rateHistory"] = [10];
    const postCount = 15;

    const isAnomalyDetectedSpy = jest.spyOn(service, "isAnomalyDetected");
    const triggerAnomalyAlertSpy = jest.spyOn(service, "triggerAnomalyAlert");

    await service.detectAnomalies(posts, postCount);

    expect(isAnomalyDetectedSpy).toHaveBeenCalledWith(posts);
    expect(triggerAnomalyAlertSpy).not.toHaveBeenCalled();
  });

  it("should detect a hashtag spike anomaly", async () => {
    const posts: SocialMediaPostDocument[] = Array.from({ length: 60 }, (_, i) => ({
      text: `Spike post ${i}`,
      hashtags: ["#spike"],
      user: { id: `user${i}`, username: `User${i}` } as User,
      platform: Platform.Twitter,
      timestamp: new Date(),
      engagementMetrics: { likes: 20, shares: 10, comments: 5 } as EngagementMetrics,
      comments: Array.from({ length: 5 }, (_, j) => ({
        user: { id: `commenter${j}`, username: `Commenter${j}` } as User,
        timestamp: new Date(),
        text: "Interesting post!",
      })),
    })) as SocialMediaPostDocument[];

    service["rateHistory"] = [50, 60, 80, 120, 150];
    const postCount = 300;

    const isAnomalyDetectedSpy = jest.spyOn(service, "isAnomalyDetected");
    const triggerAnomalyAlertSpy = jest.spyOn(service, "triggerAnomalyAlert");

    await service.detectAnomalies(posts, postCount);

    expect(isAnomalyDetectedSpy).toHaveBeenCalledWith(posts);
    expect(triggerAnomalyAlertSpy).toHaveBeenCalledWith(posts, postCount);
  });

  it("should detect a user activity spike anomaly", async () => {
    const posts: SocialMediaPostDocument[] = Array.from({ length: 25 }, () => ({
      text: "Engaging post!",
      hashtags: ["#activity"],
      user: { id: "user1", username: "User1" } as User,
      platform: Platform.Twitter,
      timestamp: new Date(),
      engagementMetrics: { likes: 10, shares: 5, comments: 2 } as EngagementMetrics,
      comments: Array.from({ length: 5 }, (_, i) => ({
        user: { id: `commenter${i}`, username: `Commenter${i}` } as User,
        timestamp: new Date(),
        text: "Great post!",
      })),
    })) as SocialMediaPostDocument[];

    service["rateHistory"] = [10, 20, 30, 40, 50];
    const postCount = 25;

    const isAnomalyDetectedSpy = jest.spyOn(service, "isAnomalyDetected");
    const triggerAnomalyAlertSpy = jest.spyOn(service, "triggerAnomalyAlert");

    await service.detectAnomalies(posts, postCount);

    expect(isAnomalyDetectedSpy).toHaveBeenCalledWith(posts);
    expect(triggerAnomalyAlertSpy).toHaveBeenCalledWith(posts, postCount);
  });

  it("should detect a platform activity spike anomaly", async () => {
    const posts: SocialMediaPostDocument[] = Array.from({ length: 110 }, (_, i) => ({
      text: `Platform post ${i}`,
      hashtags: ["#platform"],
      user: { id: `user${i}`, username: `User${i}` } as User,
      platform: Platform.Twitter,
      timestamp: new Date(),
      engagementMetrics: { likes: 30, shares: 15, comments: 7 } as EngagementMetrics,
      comments: Array.from({ length: 5 }, (_, j) => ({
        user: { id: `commenter${j}`, username: `Commenter${j}` } as User,
        timestamp: new Date(),
        text: "Nice post!",
      })),
    })) as SocialMediaPostDocument[];

    service["rateHistory"] = [10, 20, 30, 40, 50];
    const postCount = 110;

    const isAnomalyDetectedSpy = jest.spyOn(service, "isAnomalyDetected");
    const triggerAnomalyAlertSpy = jest.spyOn(service, "triggerAnomalyAlert");

    await service.detectAnomalies(posts, postCount);

    expect(isAnomalyDetectedSpy).toHaveBeenCalledWith(posts);
    expect(triggerAnomalyAlertSpy).toHaveBeenCalledWith(posts, postCount);
  });

  it("should update dynamic threshold based on average rate", async () => {
    service["rateHistory"] = [50, 60, 70, 80, 90];
    service.updateDynamicThreshold();
    expect(service["anomalyThreshold"]).toBe(0.3);

    service["rateHistory"] = [1000, 1100, 1200, 1300, 1400];
    service.updateDynamicThreshold();
    expect(service["anomalyThreshold"]).toBe(0.75);

    service["rateHistory"] = [10, 20, 30, 40, 50];
    service.updateDynamicThreshold();
    expect(service["anomalyThreshold"]).toBe(0.3);
  });
});
