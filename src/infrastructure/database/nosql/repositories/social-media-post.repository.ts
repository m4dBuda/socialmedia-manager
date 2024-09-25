import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { SocialMediaPost } from "~/core/entities/social-media-post.entity";
import { ISocialMediaPostRepository } from "~/core/interfaces/social-media-post-repository.interface";

import { SocialMediaPostDocument } from "../schemas/social-media-post.schema";

@Injectable()
export class MongoSocialMediaPostRepository implements ISocialMediaPostRepository {
  @InjectModel(SocialMediaPost.name) private readonly socialMediaPostModel: Model<SocialMediaPostDocument>;

  public async create(data: Partial<SocialMediaPostDocument>): Promise<SocialMediaPostDocument> {
    const createdPost = new this.socialMediaPostModel(data);
    return createdPost.save();
  }

  public async findAll(): Promise<SocialMediaPostDocument[]> {
    return this.socialMediaPostModel.find().exec();
  }

  public async findByHashtag(hashtag: string): Promise<SocialMediaPostDocument[]> {
    return this.socialMediaPostModel.find({ hashtags: hashtag }).exec();
  }

  public async archiveOldPosts(cutoffDate: Date): Promise<void> {
    await this.socialMediaPostModel.deleteMany({ timestamp: { $lt: cutoffDate } }).exec();
  }

  public async limitToMaxPosts(maxPosts: number): Promise<void> {
    const count = await this.socialMediaPostModel.countDocuments().exec();
    if (count > maxPosts) {
      const excess = count - maxPosts;
      await this.socialMediaPostModel.find().sort({ timestamp: 1 }).limit(excess).deleteMany().exec();
    }
  }
}
